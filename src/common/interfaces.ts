import { Document } from 'mongoose';

import { User } from '@user/interfaces';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Rating extends Document {
  ratedBy: string | User;
  rating: number;
  isDeleted?: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AggregationCoordinates {
  longitude: string | number;
  latitude: string | number;
}

export enum ENV {
  Development = 'development',
  Testing = 'testing',
  Production = 'production',
}

export const ENVs = Object.values(ENV);
