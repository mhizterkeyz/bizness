import { Document } from 'mongoose';

export enum AuthTokenType {
  FORGOTPASSWORD = 'forgot-password',
}

export enum TokenCase {
  UpperCase = 'uppercase',
  LowerCase = 'lowercase',
  RandomCase = 'randomcase',
}
export enum TokenType {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  AlphaNumeric = 'alphanumberic',
}

export const AuthTokenTypes = Object.values(AuthTokenType);

export interface AuthToken extends Document {
  tokenType: AuthTokenType;
  tokenExpires: Date;
  token: string;
  blocked?: boolean;
  meta?: unknown;
  isDeleted?: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TokenOptions {
  case?: TokenCase;
  type?: TokenType;
  tokenLength?: number;
  customFactory?: string;
}

export interface RetrieveTokenOptions {
  ignoreExpiry?: boolean;
}

export interface JWTPayload {
  sub: {
    id: string;
    password: string;
  };
}
