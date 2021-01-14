import { Inject, Injectable } from '@nestjs/common';
import { configure, Environment } from 'nunjucks';
import { join } from 'path';

import { EMAIL_SERVICE } from '@constants/index';
import { EmailService } from './interfaces';

@Injectable()
export class EmailTemplateService {
  private engine: Environment;

  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {
    const path = join(__dirname, './templates');
    this.engine = configure(path, { autoescape: true });
  }
}
