import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: configuration().isTest,
      load: [configuration],
    }),
    DatabaseModule,
    ModelsModule,
    UserModule,
    AccountModule,
    AuthModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
