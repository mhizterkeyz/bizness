import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'email of account',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'reset token sent to email',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

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
