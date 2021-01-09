import { Module } from '@nestjs/common';

import { ModelsModule } from '@models/models.module';
import { UserService } from './user.service';

@Module({
  imports: [ModelsModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
