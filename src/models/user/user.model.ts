import { Model, FilterQuery } from 'mongoose';

import { MongoDBConnection } from '@database/mongodb/mongo.database';
import { USER } from '@constants/index';
import { DBModel } from '../interfaces';
import { UserDocument } from './interfaces';
import { userSchema } from './user.schema';

export class UserModel implements DBModel<UserDocument> {
  model: Model<UserDocument>;

  constructor(connection: MongoDBConnection) {
    this.model = connection.model(USER, userSchema);
  }

  async createCollection(): Promise<void> {
    await this.model.createCollection();
  }

  async findOne(query: FilterQuery<UserDocument>): Promise<UserDocument> {
    return this.model.findOne(query);
  }

  find(query: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return this.model.find(query).exec();
  }
}
