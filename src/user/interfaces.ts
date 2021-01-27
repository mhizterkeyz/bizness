import { Document } from 'mongoose';
import { Coordinates } from '@common/interfaces';

interface BaseUser {
  name?: string;
  address?: string;
  username?: string;
  email: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface User extends BaseUser, Document {
  password: string;
  coordinates?: Coordinates;
  isDeleted?: boolean;
}

export interface JSONUser extends BaseUser {
  id: string;
}
