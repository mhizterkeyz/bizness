import { Document } from 'mongoose';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface BaseUser {
  name?: string;
  address?: string;
  username?: string;
  email: string;
  isDeleted?: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface User extends BaseUser, Document {
  password: string;
  coordinates?: Coordinates;
}

export interface JSONUser extends BaseUser {
  id: string;
}
