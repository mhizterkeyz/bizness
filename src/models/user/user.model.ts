import { Model, FilterQuery, LeanDocument, SaveOptions } from 'mongoose';

import { MongoDBConnection } from '@database/mongodb/mongo.database';
import { USER } from '@constants/index';
import { DBModel } from '../interfaces';
import { ModelSaveOptions, UserDocument } from './interfaces';
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

  async find(query: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return this.model.find(query);
  }

  async createSingle(doc: LeanDocument<UserDocument>): Promise<UserDocument> {
    return this.model.create(doc);
  }

  async createMany(
    docs: LeanDocument<UserDocument>[],
    options?: ModelSaveOptions,
  ): Promise<UserDocument[]> {
    const saveOptions: SaveOptions = {};
    if (options.session) {
      saveOptions.session = options.session.getSession();
    }

    return this.model.create(docs, saveOptions);
  }
}
