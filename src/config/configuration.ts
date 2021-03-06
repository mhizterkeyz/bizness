import { ENV, ENVs } from '@common/interfaces';

export interface Configuration {
  env: ENV;
  port: number;
  isTest: boolean;
  database: {
    url: string;
  };
  passwordHashSaltRounds: number;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  mailService: string;
  api: {
    url: string;
  };
  ui: {
    url: string;
  };
}

export default (): Configuration => ({
  env: ENVs.includes(<ENV>process.env.NODE_ENV)
    ? <ENV>process.env.NODE_ENV
    : ENV.Development,
  port: parseInt(process.env.PORT, 10) || 3000,
  isTest: process.env.NODE_ENV === 'test',
  database: {
    url: process.env.DB_URL,
  },
  passwordHashSaltRounds: +process.env.PASSWORD_HASH_SALT_ROUNDS || 8,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  mailService: process.env.EMAIL_SERVICE,
  api: {
    url: process.env.API_URL,
  },
  ui: {
    url: process.env.UI_URL,
  },
});
