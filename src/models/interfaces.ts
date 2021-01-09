export interface DBModel<T, S> {
  findOne: <K>(query: K) => Promise<S>;
  find: <K>(query: K) => Promise<S[]>;
  create: <A extends T | T[], B>(
    doc: A,
    opt?: B,
  ) => Promise<T extends S ? S : S[]>;
}

export type UserModel<T, S> = DBModel<T, S>;
