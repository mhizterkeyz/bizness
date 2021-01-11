import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { isNil } from 'lodash';

export class PaginationMetaData {
  @ApiProperty({
    description: 'Current page',
  })
  page: number;

  @ApiProperty({
    description: 'Results per page',
  })
  perPage: number;

  @ApiProperty({
    description: 'Total resource on server',
  })
  total: number;

  @ApiProperty({
    description: 'Previous page',
  })
  previousPage: number | boolean;

  @ApiProperty({
    description: 'Next Page',
  })
  nextPage: number | boolean;

  @ApiProperty({
    description: 'Total available pagess',
  })
  pageCount: number;
}

export class JSONResponse<T> {
  @ApiProperty({
    description: 'Error Code',
  })
  code?: string;

  @ApiProperty({
    description: 'Response Message',
  })
  message?: string;

  @ApiProperty({
    description: 'Response Data',
  })
  data?: T;

  @ApiProperty({
    description: 'Pagination Meta',
    type: PaginationMetaData,
  })
  meta?: PaginationMetaData;

  @ApiProperty({
    description: 'Validation Errors',
  })
  errors?: any;
}

@Injectable()
export class ResponseService {
  jsonFormat<T>(
    message?: string,
    data?: T,
    meta?: PaginationMetaData,
    code?: string,
  ): JSONResponse<T> {
    const responseObject: JSONResponse<T> = {};

    if (!isNil(message)) {
      responseObject.message = message;
    }
    if (!isNil(data)) {
      responseObject.data = data;
    }
    if (!isNil(meta)) {
      responseObject.meta = meta;
    }
    if (!isNil(code)) {
      responseObject.code = code;
    }

    return responseObject;
  }
}
