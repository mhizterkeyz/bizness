import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import * as momemt from 'moment';

import { DB_CONNECTION } from '@constants/index';
import { UserDTO } from '@user/dtos/user.dto';
import { User } from '@user/interfaces';
import { UserService } from '@user/user.service';
import { AuthService, AuthTokenService } from '@auth/auth.service';
import { AuthTokenType, TokenCase } from '@auth/interfaces';
import { AuthTokenDTO } from '@auth/dtos/auth.token.dto';
import { EmailTemplateService } from '@email/template.service';
import configuration from '@config/configuration';
import { LoginDTO } from './dtos/login.dto';
import {
  AccountEmailUpdateDTO,
  AccountPasswordUpdateDTO,
  AccountUpdateDTO,
  AccountUsernameUpdateDTO,
} from './dtos/account.update.dto';
import { LoggedInJSONUser } from './interfaces';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from './dtos/forgot.password.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject(DB_CONNECTION) private readonly connection: Connection,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  async singup(userDTO: UserDTO): Promise<LoggedInJSONUser> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      await this.uniqueDetailsOrFail(userDTO);
      const user = await this.userService.createSingleUser(userDTO, session);
      const userObject = {
        ...user.toJSON(),
        accessToken: this.authService.signJWTPayload(user.id, user.password),
      };

      await session.commitTransaction();
      return userObject;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(loginDTO: LoginDTO): Promise<LoggedInJSONUser | null> {
    const { username, password } = loginDTO;

    const user = await this.userService.validateUser(username, password);

    if (!user) return null;

    const userObject = {
      ...user.toJSON(),
      accessToken: this.authService.signJWTPayload(user.id, user.password),
    };

    return userObject;
  }

  async uniqueDetailsOrFail(userDTO: UserDTO): Promise<void> {
    if (userDTO.username) {
      await Promise.all([
        this.checkDuplicateEmail(userDTO.email),
        this.checkDuplicateUsername(userDTO.username),
      ]);
    } else {
      await this.checkDuplicateEmail(userDTO.email);
    }
  }

  async updateAccountDetails(
    user: User,
    accountUpdateDTO: AccountUpdateDTO,
  ): Promise<User> {
    return this.userService.updateUser({ _id: user.id }, accountUpdateDTO);
  }

  async updateAccountEmail(
    user: User,
    accountEmailUpdateDTO: AccountEmailUpdateDTO,
  ): Promise<User> {
    const { email, password } = accountEmailUpdateDTO;
    const validatedUser = await this.userService.validateUser(
      user.email,
      password,
    );

    if (!validatedUser) {
      throw new UnauthorizedException('invalid credentials');
    }
    await this.checkDuplicateEmail(email);

    return this.userService.updateUser({ _id: validatedUser.id }, { email });
  }

  async updateAccountUsername(
    user: User,
    accountUsernameUpdateDTO: AccountUsernameUpdateDTO,
  ): Promise<User> {
    await this.checkDuplicateUsername(accountUsernameUpdateDTO.username);
    return this.userService.updateUser(
      { _id: user.id },
      accountUsernameUpdateDTO,
    );
  }

  async updateAccountPassword(
    user: User,
    accountPasswordUpdateDTO: AccountPasswordUpdateDTO,
  ): Promise<LoggedInJSONUser> {
    const {
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = accountPasswordUpdateDTO;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('passwords do no match');
    }

    const validatedUser = await this.userService.validateUser(
      user.email,
      oldPassword,
    );

    if (!validatedUser) {
      throw new UnauthorizedException('wrong old password');
    }

    const updatedUser = await this.userService.updateUserPassword(
      validatedUser.id,
      newPassword,
    );

    return {
      ...updatedUser.toJSON(),
      accessToken: this.authService.signJWTPayload(
        updatedUser.id,
        updatedUser.password,
      ),
    };
  }

  async checkDuplicateEmail(email: string): Promise<void> {
    const emailExists = await this.userService.duplicateExits({
      email,
    });

    if (emailExists) {
      throw new ConflictException('email already taken');
    }
  }

  async checkDuplicateUsername(username: string): Promise<void> {
    const usernameExists = await this.userService.duplicateExits({
      username,
    });

    if (usernameExists) {
      throw new ConflictException('username already taken');
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<void> {
    const { email } = forgotPasswordDTO;
    const user = await this.userService.findSingleUser({ email });

    if (user) {
      const authTokenDTO: AuthTokenDTO = new AuthTokenDTO(
        AuthTokenType.FORGOTPASSWORD,
        momemt().add(5, 'minutes').toDate(),
        { user: user.id },
        { case: TokenCase.UpperCase, tokenLength: 5 },
      );

      const { token } = await this.authTokenService.createSingleAuthToken(
        authTokenDTO,
      );

      await this.emailTemplateService.sendForgotPasswordMail({
        expiresIn: '5 minutes',
        resetLink: `${configuration().ui.url}/${token}`,
        to: { email, name: user.name },
      });
    }
  }

  async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
  ): Promise<LoggedInJSONUser> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const { token, newPassword, confirmNewPassword } = resetPasswordDTO;
      const passwordsDoNotMatch = newPassword !== confirmNewPassword;
      const authToken = await this.authTokenService.retrieveAuthToken(
        token,
        AuthTokenType.FORGOTPASSWORD,
        { ignoreExpiry: true },
      );

      if (!authToken) {
        throw new UnauthorizedException('invalid password reset token');
      }

      const tokenExpired = momemt().isAfter(authToken.tokenExpires);

      if (tokenExpired) {
        throw new BadRequestException('password reset token expired');
      }

      const user = await this.userService.findSingleUser({
        _id: (<{ user: string }>authToken.meta).user,
      });

      if (!user) {
        throw new UnauthorizedException('invalid password reset token');
      }
      if (passwordsDoNotMatch) {
        throw new BadRequestException('passwords do not match');
      }

      const updatedUser = await this.userService.updateUserPassword(
        user.id,
        newPassword,
        session,
      );
      authToken.blocked = true;
      await authToken.save({ session });

      await session.commitTransaction();
      return {
        ...updatedUser.toJSON(),
        accessToken: this.authService.signJWTPayload(
          updatedUser.id,
          updatedUser.password,
        ),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
