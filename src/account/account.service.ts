import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { DB_CONNECTION } from '@constants/index';
import { DatabaseConnection } from '@database/interfaces';
import { UserDTO } from '@user/dtos/user.dto';
import { UserObject } from '@user/interfaces';
import { UserService } from '@user/user.service';
import { AuthService } from '@auth/auth.service';
import { LoginDTO } from './dtos/login.dto';

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

  async login(loginDTO: LoginDTO): Promise<UserObject> {
    const { username, password } = loginDTO;

    const user = await this.userService.validateUser(username, password);
    if (user) {
      const userObject = user.toJSON();
      userObject.accessToken = this.authService.signJWTPayload(
        user.id,
        user.password,
      );

      return userObject;
    }

    return user;
  }

  async uniqueDetailsOrFail(userDTO: UserDTO): Promise<void> {
    const emailExists = await this.userService.duplicateExits({
      email: userDTO.email,
    });

    if (emailExists) {
      throw new ConflictException('email already taken');
    }
    if (userDTO.username) {
      const usernameExists = await this.userService.duplicateExits({
        username: userDTO.username,
      });

      if (usernameExists) {
        throw new ConflictException('username already taken');
      }
    }
  }
}
