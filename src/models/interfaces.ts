export interface DBModel<T, S> {
  findOne: <K>(query: K) => Promise<S>;
  find: <K>(query: K) => Promise<S[]>;
  createSingle: <A extends T>(query: A) => Promise<S>;
  createMany: <A extends T, B>(query: A[], options?: B) => Promise<T[]>;
}

export type UserModel<T, S> = DBModel<T, S>;
