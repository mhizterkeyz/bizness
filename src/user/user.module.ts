import { Module } from '@nestjs/common';
import { Connection, Model } from 'mongoose';

import { DB_CONNECTION, USER } from '@constants/index';
import { UserService } from './user.service';
import { User } from './interfaces';
import { userSchema } from './schemas/user.schema';

@Module({
  providers: [
    {
      provide: USER,
      async useFactory(connection: Connection): Promise<Model<User>> {
        const model = connection.model<User>(USER, userSchema);

        await model.createCollection();
        return model;
      },
      inject: [DB_CONNECTION],
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
