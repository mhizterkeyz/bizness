import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import configuration from '@config/configuration';
import { AccountModule } from '@account/account.module';
import { UserModule } from '@user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configuration().jwt.secret,
        signOptions: { expiresIn: configuration().jwt.expiresIn },
      }),
    }),
    forwardRef(() => AccountModule),
    UserModule,
  ],
  providers: [LocalStrategy, JWTStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
