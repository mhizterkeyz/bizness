import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { CoordinatesDTO } from '@user/dtos/user.dto';
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

export class ListUserBiznessDTO extends PaginationDTO {
  @ApiProperty({
    description: 'search query',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  search?: string;
}
