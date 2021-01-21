import { Injectable, Inject } from '@nestjs/common';
import { getExtension } from 'mime';

import { UPLOADER } from '@constants/index';
import { Uploader } from './uploader.interface';
import { FileUploadDTO } from './dto';
import { UploadedResource } from './interfaces';

@Injectable()
export class UploadService {
  constructor(@Inject(UPLOADER) private uploader: Uploader) {}

  async uploadFile(input: FileUploadDTO): Promise<UploadedResource> {
    const extension = getExtension(input.mime);
    const currentTimestamp = new Date().getTime();
    const filename = `${encodeURI(
      input.filename || 'mock-name',
    )}-${currentTimestamp}.${extension}`;

    const path = `bizness/${filename}`;
    const url = await this.uploader.upload(path, input.data, input);
    return {
      url,
      filename,
      mime: input.mime,
      size: input.size,
    };
  }
}
