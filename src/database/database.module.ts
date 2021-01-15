import { Module, Global } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { DB_CONNECTION } from 'constants/index';
import configuration from '@config/configuration';

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory: async (): Promise<typeof mongoose> => {
        return mongoose.connect(configuration().database.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        });
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DatabaseModule {}
