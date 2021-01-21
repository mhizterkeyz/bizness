import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { UPLOADER } from '@constants/index';
import { MockService } from './mock.service';
import { Uploader } from './uploader.interface';
import { UploadService } from './uploader.service';

@Module({
  providers: [
    {
      provide: UPLOADER,
      useFactory: (adapter: HttpAdapterHost): Uploader => {
        return new MockService(adapter);
      },
      inject: [HttpAdapterHost],
    },
    UploadService,
  ],
  exports: [UploadService],
})
export class UploaderModule {}
