import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import configuration from '@config/configuration';
import { AccountModule } from '@account/account.module';
import { UserModule } from '@user/user.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configuration().jwt.secret,
        signOptions: { expiresIn: configuration().jwt.expiresIn },
      }),
    }),
    AccountModule,
    UserModule,
  ],
  providers: [LocalStrategy],
})
export class AuthModule {}
