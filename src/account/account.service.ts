import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { DB_CONNECTION } from '@constants/index';
import { DatabaseConnection } from '@database/interfaces';
import { UserDTO } from '@user/dtos/user.dto';
import { UserDocument, UserObject } from '@user/interfaces';
import { UserService } from '@user/user.service';
import { AuthService } from '@auth/auth.service';
import { LoginDTO } from './dtos/login.dto';
import {
  AccountEmailUpdateDTO,
  AccountPasswordUpdateDTO,
  AccountUpdateDTO,
  AccountUsernameUpdateDTO,
} from './dtos/account.update.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject(DB_CONNECTION) private readonly connection: DatabaseConnection,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async singup(userDTO: UserDTO): Promise<UserObject> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      await this.uniqueDetailsOrFail(userDTO);
      const user = await this.userService.createSingleUser(userDTO, session);
      const userObject = user.toJSON();
      userObject.accessToken = this.authService.signJWTPayload(
        user.id,
        user.password,
      );

      await session.commitTransaction();
      return userObject;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(loginDTO: LoginDTO): Promise<UserObject | null> {
    const { username, password } = loginDTO;

    const user = await this.userService.validateUser(username, password);

    if (!user) return null;

    const userObject = user.toJSON();
    userObject.accessToken = this.authService.signJWTPayload(
      user.id,
      user.password,
    );

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
    user: UserDocument,
    accountUpdateDTO: AccountUpdateDTO,
  ): Promise<UserDocument> {
    return this.userService.updateUser({ _id: user.id }, accountUpdateDTO);
  }

  async updateAccountEmail(
    user: UserDocument,
    accountEmailUpdateDTO: AccountEmailUpdateDTO,
  ): Promise<UserDocument> {
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
    user: UserDocument,
    accountUsernameUpdateDTO: AccountUsernameUpdateDTO,
  ): Promise<UserDocument> {
    return this.userService.updateUser(
      { _id: user.id },
      accountUsernameUpdateDTO,
    );
  }

  async updateAccountPassword(
    user: UserDocument,
    accountPasswordUpdateDTO: AccountPasswordUpdateDTO,
  ): Promise<UserDocument> {
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

    return this.userService.updateUserPassword(validatedUser.id, newPassword);
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
}
