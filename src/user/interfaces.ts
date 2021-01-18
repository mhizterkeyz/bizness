import { Document } from 'mongoose';

interface BaseUser {
  name?: string;
  username?: string;
  email: string;
  isDeleted?: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface User extends BaseUser, Document {
  password: string;
}

export type JSONUser = BaseUser;
