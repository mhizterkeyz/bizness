import { Request, Response } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { readFile, writeFile } from 'fs';
import { join } from 'path';

import configuration from '@config/configuration';
import { Uploader } from './uploader.interface';
import { FileUpload } from './interfaces';

export class MockService implements Uploader {
  private uploads: Record<string, FileUpload> = {};

  private readonly mockUploadPath: string = join(
    __dirname,
    '../../mock-uploads.json',
  );

  constructor(private adapterHost: HttpAdapterHost) {
    this.adapterHost?.httpAdapter?.get(
      '/mocks/*',
      (req: Request, res: Response) => {
        const file = req.url.split('/mocks/').pop();
        const upload = this.uploads[file];
        if (!upload) {
          res.status(404).end();
          return;
        }

        const buf = Buffer.from(upload.data.split(';base64,').pop(), 'base64');
        res.setHeader('Content-Type', upload.mime);
        res.send(buf);
      },
    );

    readFile(this.mockUploadPath, (err, data) => {
      if (!err) {
        this.uploads = JSON.parse(Buffer.from(data).toString());
      }
    });
  }

  name(): string {
    return 'mock uploader';
  }

  async upload(
    filename: string,
    _content: Buffer | string,
    upload: FileUpload,
  ): Promise<string> {
    this.uploads[filename] = upload;

    writeFile(this.mockUploadPath, JSON.stringify(this.uploads), () => {
      // Do nothing joor...
    });

    const { port } = configuration();
    const url = `http://localhost:${port}/mocks/${filename}`;

    return url;
  }

  delete(_filename: string): Promise<boolean> {
    return Promise.reject(new Error('not supported'));
  }
}
