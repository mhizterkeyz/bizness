import { Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { FilterQuery, Model, ClientSession } from 'mongoose';

import { USER } from '@constants/index';
import configuration from '@config/configuration';
import { UserDTO } from './dtos/user.dto';
import { User } from './interfaces';

@Injectable()
export class UserService {
  constructor(@Inject(USER) private readonly userModel: Model<User>) {}

  async createSingleUser(
    userDTO: UserDTO,
    session: ClientSession,
  ): Promise<User> {
    userDTO.password = await hash(
      userDTO.password,
      configuration().passwordHashSaltRounds,
    );
    const [user] = await this.userModel.create([userDTO], { session });

    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const email = username;
    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) return null;

    const invalidPassword = !(await compare(password, user.password));

    if (invalidPassword) return null;

    return user;
  }

  async findSingleUser(fields: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(fields);
  }

  async duplicateExits(fields: FilterQuery<User>): Promise<boolean> {
    const user = await this.userModel.findOne({ ...fields, isDeleted: false });

    return !!user;
  }

  async updateUser(
    query: FilterQuery<User>,
    update: Partial<User>,
    session?: ClientSession,
  ): Promise<User> {
    if (session) {
      return this.userModel.updateOne(query, update, { session });
    }

    const user = await this.userModel.findOne(query);

    await this.userModel.updateOne(query, update);
    return this.userModel.findOne({ _id: user.id });
  }

  async updateUserPassword(
    _id: string,
    password: string,
    session?: ClientSession,
  ): Promise<User> {
    const hashedPassword = await hash(
      password,
      configuration().passwordHashSaltRounds,
    );

    if (session) {
      await this.userModel.updateOne(
        { _id },
        { password: hashedPassword },
        { session },
      );
    } else {
      await this.userModel.updateOne({ _id }, { password: hashedPassword });
    }

    return this.userModel.findOne({ _id });
  }
}
