import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Connection, Model } from 'mongoose';

import configuration from '@config/configuration';
import { AccountModule } from '@account/account.module';
import { UserModule } from '@user/user.module';
import { AUTHTOKEN, DB_CONNECTION } from '@constants/index';
import { UtilModule } from '@util/util.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService, AuthTokenService } from './auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { AuthToken } from './interfaces';
import { authTokenSchema } from './schemas/auth.token.schema';

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
    UtilModule,
  ],
  providers: [
    {
      provide: AUTHTOKEN,
      async useFactory(connection: Connection): Promise<Model<AuthToken>> {
        const model = connection.model<AuthToken>(AUTHTOKEN, authTokenSchema);

        await model.createCollection();
        return model;
      },
      inject: [DB_CONNECTION],
    },
    LocalStrategy,
    JWTStrategy,
    AuthService,
    AuthTokenService,
  ],
  exports: [AUTHTOKEN, AuthService, AuthTokenService],
})
export class AuthModule {}
