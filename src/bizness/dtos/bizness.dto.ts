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

import { AddressUpdateDTO, CoordinatesDTO, RateDTO } from '@src/common/dtos';
import { PaginationDTO } from '@util/pagination.service';

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

  @ApiProperty({
    description: 'max distance to see biznesses from',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  distance?: number;
}

export class RateBiznessDTO extends RateDTO {}
