import { FilterQuery } from 'mongoose';

export const replaceID = <T>(query: FilterQuery<T>): FilterQuery<T> => {
  if (query.id) {
    (<any>query)._id = query.id;
    delete query.id;
  }
  return query;
};
