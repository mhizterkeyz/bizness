import { Model, FilterQuery, SaveOptions } from 'mongoose';

import { MongoDBConnection } from '@database/mongodb/mongo.database';
import { USER } from '@constants/index';
import { User } from '@src/user/interfaces';
import { UserModel as DBModel } from '../interfaces';
import { ModelSaveOptions, UserDocument } from './interfaces';
import { userSchema } from './user.schema';
import { replaceID } from '../util';

export class UserModel implements DBModel<User, UserDocument> {
  model: Model<UserDocument>;

  constructor(connection: MongoDBConnection) {
    this.model = connection.model(USER, userSchema);
  }

  async createCollection(): Promise<void> {
    await this.model.createCollection();
  }

  async findOne(query: FilterQuery<User>): Promise<UserDocument> {
    return this.model.findOne(replaceID(query));
  }

  async create<T extends User | User[]>(
    doc: T,
    options?: ModelSaveOptions,
  ): Promise<T extends UserDocument ? UserDocument : UserDocument[]> {
    const saveOptions: SaveOptions = {};

    if (options.session) {
      saveOptions.session = options.session.getSession();
    }
    if (Array.isArray(doc)) {
      return <Promise<T extends UserDocument ? UserDocument : UserDocument[]>>(
        this.model.create(<User[]>doc, saveOptions)
      );
    }

    return <Promise<T extends UserDocument ? UserDocument : UserDocument[]>>(
      this.model.create(<User>doc)
    );
  }

  async find(query: FilterQuery<User>): Promise<UserDocument[]> {
    return this.model.find(replaceID(query));
  }
}
