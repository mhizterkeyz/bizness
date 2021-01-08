export interface DBModel<T> {
  findOne: <K>(query: K) => Promise<T>;
  find: <K>(query: K) => Promise<T[]>;
  createSingle: <A extends T>(query: A) => Promise<T>;
  createMany: <A extends T, B>(query: A[], options?: B) => Promise<T[]>;
}
