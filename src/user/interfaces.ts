import { Document } from 'mongoose';

interface BaseUser {
  name?: string;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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
