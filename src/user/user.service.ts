import { Inject, Injectable } from '@nestjs/common';

import { USER } from '@constants/index';
import { UserModel } from '@models/user/user.model';
import { UserDTO } from './dtos/user.dto';
import { SessionManager } from '@database/mongodb/mongo.database';
import { User } from './interfaces';

@Injectable()
export class UserService {
  constructor(@Inject(USER) private readonly userModel: UserModel) {}

  async createSingleUser(
    userDTO: UserDTO,
    session: SessionManager,
  ): Promise<User> {
    const [user] = await this.userModel.createMany([userDTO], { session });

    return user.toJSON();
  }
}
