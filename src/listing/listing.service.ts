import { Inject, Injectable } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';

import { LISTING, LISTINGRATING } from '@constants/index';
import { UploadService } from '@uploader/uploader.service';
import { Listing, ListingRating } from './interfaces';
import { ListingDTO } from './dtos/listing.dto';

@Injectable()
export class ListingService {
  constructor(
    @Inject(LISTING) private readonly listingModel: Model<Listing>,
    @Inject(LISTINGRATING)
    private readonly listingRatingModel: Model<ListingRating>,

    private readonly uploadService: UploadService,
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
}
