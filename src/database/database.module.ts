import { Module, Global } from '@nestjs/common';

import { DB_CONNECTION } from '@src/constants';
import { MongoDBConnection } from './mongodb/mongo.database';

const mongoDBProvider = {
  provide: DB_CONNECTION,
  useClass: MongoDBConnection
};

@Global()
@Module({
  providers: [mongoDBProvider],
  exports: [mongoDBProvider],
})
export class DatabaseModule {}
