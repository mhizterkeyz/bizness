import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { isEmpty } from 'lodash';

import { LISTING, LISTINGRATING } from '@constants/index';
import { UploadService } from '@uploader/uploader.service';
import {
  AggregatePaginationResult,
  PaginationService,
} from '@util/pagination.service';
import { User } from '@user/interfaces';
import { Bizness } from '@bizness/interfaces';
import { JSONListing, Listing, ListingRating } from './interfaces';
import {
  GetListingsDTO,
  ListingDTO,
  RateListingDTO,
  UpdateListingDTO,
} from './dtos/listing.dto';
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

  async updateListing(
    _id: string,
    bizness: string,
    updateListingDTO: UpdateListingDTO,
  ): Promise<JSONListing> {
    const listing = await this.findListingOrFail({
      _id,
      bizness,
      isDeleted: false,
    });
    const { image: file, ...regularFields } = updateListingDTO;
    const update: Partial<Listing> = { ...regularFields };

    if (!isEmpty(file)) {
      const { url: image } = await this.uploadService.uploadFile(file);
      update.image = image;
    }

    await this.listingModel.updateOne({ _id: listing.id }, update);
    return this.getSingleListing(_id);
  }

  async deleteListing(_id: string, bizness: string): Promise<Listing> {
    const listing = await this.findListingOrFail({
      _id,
      bizness,
      isDeleted: false,
    });

    return this.listingModel.findOneAndUpdate(
      { _id: listing.id },
      { isDeleted: true },
      { new: true, useFindAndModify: false },
    );
  }

  async rateListing(
    user: User,
    listingID: string,
    rateBiznessDTO: RateListingDTO,
  ): Promise<JSONListing> {
    const { rating } = rateBiznessDTO;
    const listing = await (
      await this.findListingOrFail({
        _id: listingID,
      })
    )
      .populate('bizness')
      .execPopulate();

    if (user.id.toString() === (<Bizness>listing.bizness).owner.toString()) {
      throw new BadRequestException('you cannot rate your own listing');
    }

    await this.listingRatingModel.findOneAndUpdate(
      {
        ratedBy: user.id,
        listing: listing.id,
      },
      { isDeleted: false, rating },
      { upsert: true, useFindAndModify: false, new: true },
    );

    return this.getSingleListing(listingID);
  }

  async getRating(user: User, listing: string): Promise<ListingRating> {
    const rating = await this.findRatingOrFail({ ratedBy: user.id, listing });

    return rating.populate('listing').execPopulate();
  }

  async findListingOrFail(query: FilterQuery<Listing>): Promise<Listing> {
    query.isDeleted = false;

    const listing = await this.listingModel.findOne(query);

    if (!listing) {
      throw new NotFoundException('listing not found');
    }

    return listing;
  }

  async findRatingOrFail(
    query: FilterQuery<ListingRating>,
  ): Promise<ListingRating> {
    query.isDeleted = false;

    const rating = await this.listingRatingModel.findOne(query);

    if (!rating) {
      throw new NotFoundException('rating not found');
    }

    return rating;
  }
}
