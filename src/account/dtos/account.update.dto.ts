import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CoordinatesDTO } from '@src/user/dtos/user.dto';

export class AccountUpdateDTO {
  @ApiProperty({
    description: 'name of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'user location',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'user coordinates',
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  coordinates?: CoordinatesDTO;
}

export class AccountEmailUpdateDTO {
  @ApiProperty({
    description: 'email of user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AccountUsernameUpdateDTO {
  @ApiProperty({
    description: 'username of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class AccountPasswordUpdateDTO {
  @ApiProperty({
    description: 'old password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'new password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'confirm new password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
