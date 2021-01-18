import { Inject, Injectable } from '@nestjs/common';
import { configure, Environment } from 'nunjucks';
import { join } from 'path';

import { EMAIL_SERVICE } from '@constants/index';
import {
  Address,
  EmailService,
  ForgotPasswordMailPayload,
  Mail,
} from './interfaces';

@Injectable()
export class EmailTemplateService {
  private engine: Environment;

  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {
    const path = join(__dirname, '../../templates');
    this.engine = configure(path, { autoescape: true });
  }

  async sendForgotPasswordMail(
    payload: ForgotPasswordMailPayload,
  ): Promise<void> {
    const { to, ...templatePayload } = payload;
    const from = new Address('accounts@bizness.com', 'Bizness');
    const mail = new Mail(
      from,
      [to],
      'Password recovery',
      this.engine.render('forgot-password.html', templatePayload),
    );

    await this.emailService.sendMail(mail);
  }
}
