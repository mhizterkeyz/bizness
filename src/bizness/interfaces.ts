import { Document } from 'mongoose';

import { Coordinates, JSONUser, User } from '@user/interfaces';

interface BaseBizness {
  name: string;
  address: string;
  isDeleted?: boolean;
}

export interface Bizness extends BaseBizness, Document {
  owner: string | User;
  coordinates: Coordinates;
}

export interface JSONBizness extends BaseBizness {
  id: string;
  owner: string | JSONUser;
}
