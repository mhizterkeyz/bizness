import { FilterQuery } from 'mongoose';

import { SessionManager } from '@database/mongodb/mongo.database';
import { DBSession } from '@database/interfaces';

export interface ModelSaveOptions {
  session?: SessionManager;
}

export interface SaveOptions {
  session?: DBSession;
}

export interface DBModel<T, S, K extends SaveOptions> {
  findOne: (query: FilterQuery<T>) => Promise<S>;
  find: (query: FilterQuery<T>) => Promise<S[]>;
  create: <A extends T | T[]>(
    doc: A,
    opt?: K,
  ) => Promise<T extends S ? S : S[]>;
  updateMany: <A extends T>(
    query: FilterQuery<T>,
    update: Partial<A>,
    opt?: K,
  ) => Promise<S[]>;
  updateOne: <A extends T>(
    query: FilterQuery<T>,
    update: Partial<A>,
    opt?: K,
  ) => Promise<S>;
}

export type UserModel<T, S> = DBModel<T, S, SaveOptions>;
