import * as mongoose from 'mongoose';

import configuration from '@src/config/configuration';
import { DatabaseConnection } from "../interfaces";

export class MongoDBConnection implements DatabaseConnection {
  private connection: typeof mongoose;

  constructor () {
    mongoose.connect(configuration().database.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }).then((mongoConnection) => {
      this.connection = mongoConnection;
    });
  }

  async startSession() {
    return this.connection.startSession();
  }
}