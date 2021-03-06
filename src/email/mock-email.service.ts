import { EmailService, Mail } from './interfaces';

export class MockMailService implements EmailService {
  async sendMail(mail: Mail): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(
      `
      [Email]\n
      from: ${mail.from.name}<${mail.from.email}>\n
      to: ${mail.to
        .map(
          (mailTo) =>
            `${mailTo.name ? `${mailTo.name} ` : ''}<${mailTo.email}>`,
        )
        .join(', ')}\n
        ${
          mail.cc
            ? `cc: ${mail.cc
                .map(
                  (mailTo) =>
                    `${mailTo.name ? `${mailTo.name} ` : ''}<${mailTo.email}>`,
                )
                .join(', ')}\n
            `
            : ''
        }
      subject: ${mail.subject}\n
      body: ${mail.body
        .replace(/<head>.*<\/head>/gi, '')
        .replace(/<.+?>/gi, '')}\n
      attachments: ${mail?.attachments?.length}
            `,
    );
  }
}
