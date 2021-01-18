import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import configuration from '@config/configuration';
import { User } from '@user/interfaces';
import { UserService } from '@user/user.service';
import { JWTPayload } from '../interfaces';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  validate(payload: JWTPayload): Promise<User> {
    const {
      sub: { id, password },
    } = payload;

    return this.userService.findSingleUser({
      _id: id,
      password,
      isDeleted: false,
    });
  }
}

export class JWTGuard extends AuthGuard('jwt') {}
