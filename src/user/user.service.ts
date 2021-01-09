import { Inject, Injectable } from '@nestjs/common';

import { USER } from '@constants/index';
import { UserModel } from '@models/interfaces';
import { DBSession } from '@database/interfaces';
import { UserDTO } from './dtos/user.dto';
import { User, UserDocument } from './interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER) private readonly userModel: UserModel<User, UserDocument>,
  ) {}

  async createSingleUser(
    userDTO: UserDTO,
    session: DBSession,
  ): Promise<UserDocument> {
    const [user] = await this.userModel.create([userDTO], { session });

    return user;
  }

  async duplicateExits(fields: Partial<User>): Promise<boolean> {
    const user = await this.userModel.findOne({ ...fields, isDeleted: false });

    return !!user;
  }
}
