export class Attachment {
  constructor(public name: string, public type: string, public data: string) {}
}

export class Address {
  constructor(public email: string, public name?: string) {}
}

export class Mail {
  constructor(
    public from: Address,
    public to: Address[],
    public subject: string,
    public body: string,
    public attachments?: Attachment[],
    public cc?: Address[],
  ) {}
}

export class ForgotPasswordMailPayload {
  constructor(
    public resetLink: string,
    public expiresIn: string,
    public to: Address,
  ) {}
}

export interface EmailService {
  sendMail: (mail: Mail) => Promise<void>;
}
