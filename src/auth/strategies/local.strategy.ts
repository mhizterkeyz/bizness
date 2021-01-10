import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AccountService } from '@account/account.service';
import { UserObject } from '@user/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountService: AccountService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserObject> {
    const user = await this.accountService.login({ username, password });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    return user;
  }
}

export class LocalGuard extends AuthGuard('local') {}
