import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import configuration from '@config/configuration';
import { UserDocument } from '@user/interfaces';
import { UserService } from '@user/user.service';
import { JWTPayload } from '../auth.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  validate(payload: JWTPayload): Promise<UserDocument> {
    const {
      sub: { id, password },
    } = payload;

    return this.userService.findSingleUser({ id, password });
  }
}

export class JWTGuard extends AuthGuard('jwt') {}
