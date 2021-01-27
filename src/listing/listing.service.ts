import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { isEmpty } from 'lodash';

import { LISTING, LISTINGRATING } from '@constants/index';
import { UploadService } from '@uploader/uploader.service';
import {
  AggregatePaginationResult,
  PaginationService,
} from '@src/util/pagination.service';
import { JSONListing, Listing, ListingRating } from './interfaces';
import { GetListingsDTO, ListingDTO } from './dtos/listing.dto';
import { getListingAggregation } from './listing.aggregation';

@Injectable()
export class ListingService {
  constructor(
    @Inject(LISTING) private readonly listingModel: Model<Listing>,
    @Inject(LISTINGRATING)
    private readonly listingRatingModel: Model<ListingRating>,

    private readonly uploadService: UploadService,
    private readonly paginationService: PaginationService,
  ) {}

  async createListing(
    bizness: string,
    listingDTO: ListingDTO,
    session?: ClientSession,
  ): Promise<Listing> {
    const { image: file, ...regularFields } = listingDTO;
    const { url: image } = await this.uploadService.uploadFile(file);
    const payload: Partial<Listing> = { ...regularFields, image, bizness };

    if (session) {
      const [listing] = await this.listingModel.create([payload], { session });
      return listing;
    }

    return this.listingModel.create(payload);
  }

  async getSingleListing(id: string): Promise<JSONListing> {
    const pipeline = getListingAggregation({ _id: Types.ObjectId(id) });
    const [listing] = await this.listingModel.aggregate<JSONListing>(pipeline);

    if (isEmpty(listing)) {
      throw new NotFoundException('listing not found');
    }

    return listing;
  }

  async getListings(
    getListingsDTO: GetListingsDTO,
    biznessID?: string,
  ): Promise<AggregatePaginationResult<JSONListing>> {
    const {
      search = '',
      page = 1,
      limit = 10,
      latitude,
      longitude,
      distance,
    } = getListingsDTO;
    const $match: FilterQuery<Listing> = {};
    let coordinates = null;
    if (latitude && longitude) {
      coordinates = { latitude, longitude };
    }
    if (!isEmpty(biznessID)) {
      const bizness: unknown = Types.ObjectId(biznessID);
      $match.bizness = bizness;
    }
    const aggregation = getListingAggregation(
      $match,
      search,
      coordinates,
      distance,
    );

    return this.paginationService.aggregatePaginate<JSONListing, Listing>(
      this.listingModel,
      aggregation,
      {
        page,
        limit,
      },
    );
  }
}
