import { Document } from 'mongoose';

export enum TokenType {
  FORGOTPASSWORD = 'forgot-password',
}

export const TokenTypes = Object.values(TokenType);

export interface BaseAuthTokenInterface {
  tokenType: TokenType;
  tokenExpires: Date;
  token: string;
  <T>(meta: T);
}

export type AuthToken = BaseAuthTokenInterface;
export type AuthTokenObject = BaseAuthTokenInterface;

export interface AuthTokenDocument extends AuthToken, Document {}
