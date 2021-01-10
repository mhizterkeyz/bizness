import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JWTPayload {
  sub: {
    id: string;
    password: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtSerice: JwtService) {}

  signJWTPayload(id: string, password: string): string {
    const payload: JWTPayload = { sub: { id, password } };

    return this.jwtSerice.sign(payload);
  }

  decodeJWTToken(token: string): JWTPayload {
    return this.jwtSerice.verify<JWTPayload>(token);
  }
}
