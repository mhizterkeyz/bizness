import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { LISTING, LISTINGRATING } from '@constants/index';
import { Listing, ListingRating } from './interfaces';

@Injectable()
export class ListingService {
  constructor(
    @Inject(LISTING) private readonly listingModel: Model<Listing>,
    @Inject(LISTINGRATING)
    private readonly listingRatingModel: Model<ListingRating>,
  ) {}
}
