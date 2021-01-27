import { Module } from '@nestjs/common';
import { Connection, Model } from 'mongoose';

import { BIZNESS, BIZNESSRATING, DB_CONNECTION } from '@constants/index';
import { UtilModule } from '@util/util.module';
import { ListingModule } from '@src/listing/listing.module';
import { Bizness, BiznessRating } from './interfaces';
import { biznessRatingsSchema, biznessSchema } from './schemas/bizness.schema';
import { BiznessService } from './bizness.service';
import { BiznessController } from './bizness.controller';

@Module({
  imports: [UtilModule, ListingModule],
  providers: [
    {
      provide: BIZNESS,
      inject: [DB_CONNECTION],
      async useFactory(connection: Connection): Promise<Model<Bizness>> {
        const model = connection.model<Bizness>(BIZNESS, biznessSchema);

        await model.createCollection();
        return model;
      },
    },
    {
      provide: BIZNESSRATING,
      inject: [DB_CONNECTION],
      async useFactory(connection: Connection): Promise<Model<BiznessRating>> {
        const model = connection.model<BiznessRating>(
          BIZNESSRATING,
          biznessRatingsSchema,
        );

        await model.createCollection();
        return model;
      },
    },
    BiznessService,
  ],
  exports: [BiznessService],
  controllers: [BiznessController],
})
export class BiznessModule {}
