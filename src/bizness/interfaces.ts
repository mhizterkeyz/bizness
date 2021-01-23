import { Document } from 'mongoose';

import { Coordinates, JSONUser, User } from '@user/interfaces';

interface BaseBizness {
  name: string;
  address: string;

  readonly rating?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Rating extends Document {
  ratedBy: string | User;
  rating: number;
  isDeleted?: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface Bizness extends BaseBizness, Document {
  owner: string | User;
  coordinates: Coordinates;
  isDeleted?: boolean;
}

export interface BiznessRating extends Rating {
  bizness: string | Bizness;
}

export interface JSONBizness extends BaseBizness {
  id: string;
  owner: string | JSONUser;
}
