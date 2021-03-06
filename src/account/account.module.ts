import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { UtilModule } from '@util/util.module';
import { EmailModule } from '@email/email.module';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  imports: [UserModule, forwardRef(() => AuthModule), UtilModule, EmailModule],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
