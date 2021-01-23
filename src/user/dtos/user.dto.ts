import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
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

export class UserDTO {
  @ApiProperty({
    description: 'fullname of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'username of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'email of user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'user password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'user address details',
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  addressUpdateDTO?: AddressUpdateDTO;
}
