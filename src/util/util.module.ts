import { Module } from '@nestjs/common';

import { PaginationService } from './pagination.service';
import { ResponseService } from './response.service';
import { UtilService } from './util.service';

@Module({
  providers: [ResponseService, UtilService, PaginationService],
  exports: [ResponseService, UtilService, PaginationService],
})
export class UtilModule {}
