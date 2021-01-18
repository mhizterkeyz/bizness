import { AuthTokenType, TokenOptions } from '../interfaces';

export class AuthTokenDTO {
  constructor(
    public tokenType: AuthTokenType,
    public tokenExpires: Date,
    public meta?: unknown,
    public options?: TokenOptions,
  ) {}
}
