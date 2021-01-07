import * as mongoose from 'mongoose';

import configuration from '@src/config/configuration';
import { DatabaseConnection } from '../interfaces';

export class MongoDBConnection implements DatabaseConnection {
  private connection: typeof mongoose;
  model: typeof mongoose.connection.model;

  async connect(): Promise<void> {
    this.connection = await mongoose.connect(configuration().database.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    this.model = this.connection.model;
  }

  async startSession() {
    return this.connection.startSession();
  }
}
