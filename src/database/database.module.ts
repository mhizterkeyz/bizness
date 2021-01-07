import { Module, Global } from '@nestjs/common';

import { DB_CONNECTION } from '@src/constants';
import { MongoDBConnection } from './mongodb/mongo.database';

const mongoDBProvider = {
  provide: DB_CONNECTION,
  useFactory: async (): Promise<MongoDBConnection> => {
    const dbInstance = new MongoDBConnection();
    await dbInstance.connect();
    return dbInstance;
  },
};

@Global()
@Module({
  providers: [mongoDBProvider],
  exports: [mongoDBProvider],
})
export class DatabaseModule {}
