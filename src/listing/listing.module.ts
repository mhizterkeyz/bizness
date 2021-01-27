import { Module } from '@nestjs/common';
import { Connection, Model } from 'mongoose';

import { DB_CONNECTION, LISTING, LISTINGRATING } from '@constants/index';
import { UploaderModule } from '@uploader/uploader.module';
import { UtilModule } from '@src/util/util.module';
import { Listing, ListingRating } from './interfaces';
import { listingSchema, listingRatingsSchema } from './schemas/listing.schema';
import { ListingService } from './listing.service';

@Module({
  imports: [UploaderModule, UtilModule],
  providers: [
    {
      provide: LISTING,
      inject: [DB_CONNECTION],
      async useFactory(connection: Connection): Promise<Model<Listing>> {
        const model = connection.model<Listing>(LISTING, listingSchema);

        await model.createCollection();
        return model;
      },
    },
    {
      provide: LISTINGRATING,
      inject: [DB_CONNECTION],
      async useFactory(connection: Connection): Promise<Model<ListingRating>> {
        const model = connection.model<ListingRating>(
          LISTINGRATING,
          listingRatingsSchema,
        );

        await model.createCollection();
        return model;
      },
    },
    ListingService,
  ],
  exports: [ListingService],
})
export class ListingModule {}
