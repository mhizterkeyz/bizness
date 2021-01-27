import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { FileUploadDTO } from '@src/uploader/dto';
import { PaginationDTO } from '@src/util/pagination.service';
import { RateDTO } from '@src/common/dtos';

export class ListingDTO {
  @ApiProperty({
    description: 'listing name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'listing image',
    required: true,
  })
  @ValidateNested()
  @IsNotEmpty()
  image: FileUploadDTO;
}

export class UpdateListingDTO {
  @ApiProperty({
    description: 'listing name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'listing image',
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  image: FileUploadDTO;
}

export class GetUserListingsDTO extends PaginationDTO {
  @ApiProperty({
    description: 'search query',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export class GetListingsDTO extends GetUserListingsDTO {
  @ApiProperty({
    description: 'locality latitude',
    required: false,
  })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'locality longitude',
    required: false,
  })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'max distance to see listings from',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  distance?: number;
}

export class RateListingDTO extends RateDTO {}
