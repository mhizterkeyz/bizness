import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { DB_CONNECTION } from '@constants/index';
import { DatabaseConnection } from '@database/interfaces';
import { UserDTO } from '@user/dtos/user.dto';
import { UserDocument } from '@user/interfaces';
import { UserService } from '@user/user.service';

@Injectable()
export class AccountService {
  constructor(
    @Inject(DB_CONNECTION) private readonly connection: DatabaseConnection,
    private readonly userService: UserService,
  ) {}

  async singup(userDTO: UserDTO): Promise<UserDocument> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      await this.uniqueDetailsOrFail(userDTO);
      const user = await this.userService.createSingleUser(userDTO, session);

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
