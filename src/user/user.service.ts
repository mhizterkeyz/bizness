import { Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { FilterQuery } from 'mongoose';

import { USER } from '@constants/index';
import { UserModel } from '@models/interfaces';
import { DBSession } from '@database/interfaces';
import configuration from '@src/config/configuration';
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
    userDTO.password = await hash(
      userDTO.password,
      configuration().passwordHashSaltRounds,
    );
    const [user] = await this.userModel.create([userDTO], { session });

    return user;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    const email = username;
    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) return null;

    const invalidPassword = !(await compare(password, user.password));

    if (invalidPassword) return null;

    return user;
  }

  async findSingleUser(fields: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(fields);
  }

  async duplicateExits(fields: FilterQuery<User>): Promise<boolean> {
    const user = await this.userModel.findOne({ ...fields, isDeleted: false });

    return !!user;
  }

  async updateUser(
    query: FilterQuery<User>,
    update: Partial<User>,
    session?: DBSession,
  ): Promise<UserDocument> {
    if (session) {
      return this.userModel.updateOne(query, update, { session });
    }

    return this.userModel.updateOne(query, update);
  }

  async updateUserPassword(
    _id: string,
    password: string,
    session?: DBSession,
  ): Promise<UserDocument> {
    const hashedPassword = await hash(
      password,
      configuration().passwordHashSaltRounds,
    );

    if (session) {
      return this.userModel.updateOne(
        { _id },
        { password: hashedPassword },
        { session },
      );
    }

    return this.userModel.updateOne({ _id }, { password: hashedPassword });
  }
}
