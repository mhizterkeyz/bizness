import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { AddressUpdateDTO, CoordinatesDTO } from '@src/common/dtos';
import { PaginationDTO } from '@util/pagination.service';
import { BiznessListSortBy, BiznessListSortBys } from '../interfaces';

export class BiznessDTO {
  @ApiProperty({
    description: 'bizness name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'bizness address',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'bizness coordinates',
    required: true,
  })
  @ValidateNested()
  @IsNotEmpty()
  coordinates: CoordinatesDTO;
}

export class UpdateBiznessDTO {
  @ApiProperty({
    description: 'bizness name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'bizness address details',
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  addressUpdateDTO?: AddressUpdateDTO;
}

export class ListUserBiznessDTO extends PaginationDTO {
  @ApiProperty({
    description: 'search query',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'sort bizness list by - rating, distance or createdAt',
    required: false,
  })
  @IsIn(BiznessListSortBys)
  @IsOptional()
  sortBy?: BiznessListSortBy;
}

export class ListBiznessDTO extends ListUserBiznessDTO {
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
}

export class RateBiznessDTO {
  @ApiProperty({
    description: 'rating from 0 - 5',
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

export class RouteIDDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
