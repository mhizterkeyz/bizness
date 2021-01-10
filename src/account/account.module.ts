import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { AccountService } from './account.service';

@Module({
  imports: [UserModule, AuthModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
