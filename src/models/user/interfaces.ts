import { Document } from 'mongoose';

import { User } from '@user/interfaces';
import { DBSession } from '@database/interfaces';
import { SessionManager } from '@database/mongodb/mongo.database';

export interface UserDocument extends User, Document {}

export interface ModelSaveOptions {
  session?: SessionManager;
}
