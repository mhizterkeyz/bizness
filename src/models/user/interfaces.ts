import { Document } from 'mongoose';

import { User } from '@user/interfaces';
import { SessionManager } from '@database/mongodb/mongo.database';

export interface UserDocument extends Document, User {}

export interface ModelSaveOptions {
  session?: SessionManager;
}
