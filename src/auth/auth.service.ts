import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientSession, FilterQuery, Model } from 'mongoose';

import { AUTHTOKEN } from '@constants/index';
import { UtilService } from '@util/util.service';
import {
  AuthToken,
  RetrieveTokenOptions,
  TokenCase,
  TokenType,
  JWTPayload,
  AuthTokenType,
} from './interfaces';
import { AuthTokenDTO } from './dtos/auth.token.dto';

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

@Injectable()
export class AuthTokenService {
  constructor(
    @Inject(AUTHTOKEN) private readonly authTokenModel: Model<AuthToken>,

    private readonly utilService: UtilService,
  ) {}

  async createSingleAuthToken(
    authTokenDTO: AuthTokenDTO,
    session?: ClientSession,
  ): Promise<AuthToken> {
    const { options, meta, tokenExpires, tokenType } = authTokenDTO;
    const factory = options.customFactory || this.getFactory(options.type);
    const generatedToken = await this.generateToken(
      options.tokenLength || 8,
      factory,
      tokenType,
    );
    const token = this.convertCase(options.case, generatedToken);
    const authTokenObj = {
      meta,
      tokenExpires,
      token,
      tokenType,
    };
    let authToken: AuthToken;

    if (session) {
      [authToken] = await this.authTokenModel.create([authTokenObj], {
        session,
      });
    } else {
      authToken = await this.authTokenModel.create(authTokenObj);
    }

    return authToken;
  }

  async retrieveAuthToken(
    token: string,
    tokenType: AuthTokenType,
    options: RetrieveTokenOptions = { ignoreExpiry: false },
  ): Promise<AuthToken> {
    const query: FilterQuery<AuthToken> = {
      token,
      blocked: false,
      isDeleted: false,
      tokenType,
    };

    if (!options.ignoreExpiry) {
      query.tokenExpires = { $gt: new Date() };
    }

    return this.authTokenModel.findOne(query);
  }

  getFactory(type: TokenType): string {
    switch (type) {
      case TokenType.Alphabetic:
        return 'abcdefghijklmnopqrstuvwxyz';
      case TokenType.Numeric:
        return '1234567890';
      default:
        return 'abcdefghijklmnopqrstuvwxyz1234567890';
    }
  }

  convertCase(caseOption: TokenCase, token: string): string {
    switch (caseOption) {
      case TokenCase.LowerCase:
        return token.toLowerCase();
      case TokenCase.UpperCase:
        return token.toUpperCase();
      default:
        return token;
    }
  }

  async generateToken(
    length: number,
    factory: string,
    tokenType: AuthTokenType,
  ): Promise<string> {
    const token = this.utilService.generateRandomString(length, factory);
    const tokenExists = await this.authTokenModel.findOne({
      token,
      blocked: false,
      isDeleted: false,
      tokenType,
    });

    if (tokenExists) {
      return this.generateToken(length, factory, tokenType);
    }

    return token;
  }
}
