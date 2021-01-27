import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CoordinatesDTO {
  @ApiProperty({
    description: 'coordinate latitude',
    required: true,
  })
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'coordinate longitude',
    required: true,
  })
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}

export class AddressUpdateDTO {
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

export class RateDTO {
  @ApiProperty({
    description: 'rating from 0 - 5',
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
