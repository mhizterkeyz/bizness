import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
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
