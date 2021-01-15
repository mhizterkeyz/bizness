import { Module } from '@nestjs/common';

import { EMAIL_SERVICE } from '@constants/index';
import configuration from '@config/configuration';
import { MockMailService } from './mock-email.service';
import { EmailTemplateService } from './template.service';
import { EmailService } from './interfaces';

@Module({
  providers: [
    EmailTemplateService,
    {
      provide: EMAIL_SERVICE,
      useFactory: (): EmailService => {
        const { mailService } = configuration();
        let selectedMailService: EmailService;
        let message: string;

        switch (mailService) {
          default:
            message = 'using mock mail service';
            selectedMailService = new MockMailService();
        }

        // eslint-disable-next-line no-console
        console.log(message);
        return selectedMailService;
      },
    },
  ],
  exports: [EmailTemplateService, EMAIL_SERVICE],
})
export class EmailModule {}
