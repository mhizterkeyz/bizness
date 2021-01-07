import { Global, Module } from '@nestjs/common';

import { DB_CONNECTION, USER } from '@constants/index';
import { MongoDBConnection } from '@database/mongodb/mongo.database';
import { DBModel } from './interfaces';
import { UserDocument } from './user/interfaces';
import { UserModel } from './user/user.model';

@Global()
@Module({
  providers: [
    {
      provide: USER,
      useFactory: async (
        connection: MongoDBConnection,
      ): Promise<DBModel<UserDocument>> => {
        const model = new UserModel(connection);
        await model.createCollection();
        return model;
      },
      inject: [DB_CONNECTION],
    },
  ],
})
export class ModelsModule {}
