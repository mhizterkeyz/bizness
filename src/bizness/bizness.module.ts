import { Module } from '@nestjs/common';
import { Connection, Model } from 'mongoose';

import { BIZNESS, DB_CONNECTION } from '@constants/index';
import { Bizness } from './interfaces';
import { biznessSchema } from './schemas/bizness.schema';

@Module({
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
  ],
})
export class BiznessModule {}
