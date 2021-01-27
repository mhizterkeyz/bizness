import { ApiProperty } from '@nestjs/swagger';
import { FileUploadDTO } from '@src/uploader/dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

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
