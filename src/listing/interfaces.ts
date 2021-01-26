import { Document } from 'mongoose';

import { Bizness } from '@bizness/interfaces';
import { Rating } from '@common/interfaces';

interface BaseListing {
  name: string;
  image: string;

  readonly rating?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Listing extends BaseListing, Document {
  bizness: string | Bizness;
  isDeleted?: boolean;
}

export interface ListingRating extends Rating {
  listing: string | Listing;
}

export interface JSONBizness extends BaseListing {
  id: string;
  bizness: string | JSONBizness;
}
