export interface DBModel<T> {
  findOne: <K>(query: K) => Promise<T>;
  find: <K>(query: K) => Promise<T[]>;
}
