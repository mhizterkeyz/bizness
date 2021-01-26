import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { UtilModule } from './util/util.module';
import { EmailModule } from './email/email.module';
import { BiznessModule } from './bizness/bizness.module';
import { UploaderModule } from './uploader/uploader.module';
import { ListingModule } from './listing/listing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: configuration().isTest,
      load: [configuration],
    }),
    DatabaseModule,
    UserModule,
    AccountModule,
    AuthModule,
    UtilModule,
    EmailModule,
    BiznessModule,
    UploaderModule,
    ListingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
