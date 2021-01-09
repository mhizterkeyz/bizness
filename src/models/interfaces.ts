import { FilterQuery } from 'mongoose';

export interface DBModel<T, S> {
  findOne: (query: FilterQuery<T>) => Promise<S>;
  find: (query: FilterQuery<T>) => Promise<S[]>;
  create: <A extends T | T[], B>(
    doc: A,
    opt?: B,
  ) => Promise<T extends S ? S : S[]>;
}

export type UserModel<T, S> = DBModel<T, S>;
