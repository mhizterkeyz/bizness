import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsMimeType,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UploadedResourceDTO {
  public url: string;

  public filename: string;

  public size?: number;

  public type: string;
}

export class FileUploadDTO {
  @ApiProperty({
    description: 'file name',
    required: false,
  })
  @IsString()
  @IsOptional()
  filename?: string;

  @ApiProperty({
    description: 'file size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiProperty({
    description: 'file MIME type',
    required: true,
  })
  @IsMimeType()
  @IsNotEmpty()
  mime: string;

  @ApiProperty({
    description: 'Base64 encoded data',
    required: true,
  })
  @IsBase64()
  @IsNotEmpty()
  data: string;
}
