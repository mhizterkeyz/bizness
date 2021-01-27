import { Document } from 'mongoose';

import { JSONUser, User } from '@user/interfaces';
import { Coordinates, Rating } from '@common/interfaces';

interface BaseBizness {
  name: string;
  address: string;

  readonly rating?: number;
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
