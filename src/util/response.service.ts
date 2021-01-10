import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

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

    if (this.isNotNil(message)) {
      responseObject.message = message;
    }
    if (this.isNotNil(data)) {
      responseObject.data = data;
    }
    if (this.isNotNil(meta)) {
      responseObject.meta = meta;
    }
    if (this.isNotNil(code)) {
      responseObject.code = code;
    }

    return responseObject;
  }

  private isNotNil(value) {
    return value !== null && value !== undefined;
  }
}
