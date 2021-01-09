import * as mongoose from 'mongoose';

import configuration from '@src/config/configuration';
import { DatabaseConnection, DBSession } from '../interfaces';

export class SessionManager implements DBSession {
  constructor(private readonly session: mongoose.ClientSession) {}

  startTransaction(): void {
    this.session.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this.session.commitTransaction();
  }

  async abortTransaction(): Promise<void> {
    await this.session.abortTransaction();
  }

  endSession(): void {
    this.session.endSession();
  }

  getSession(): mongoose.ClientSession {
    return this.session;
  }
}
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

  async startSession(): Promise<SessionManager> {
    const session = await this.connection.startSession();
    return new SessionManager(session);
  }
}
