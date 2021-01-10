import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { get } from 'lodash';

import { LocalGuard } from '@auth/strategies/local.strategy';
import { UserObject } from '@user/interfaces';
import { JSONResponse, ResponseService } from '@util/response.service';
import { UserDTO } from '@user/dtos/user.dto';
import { AccountService } from './account.service';
import { LoginDTO } from './dtos/login.dto';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    description: 'Login to account',
  })
  @ApiBody({
    type: LoginDTO,
  })
  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Req() req: Request,
    @Body() _loginDTO: LoginDTO,
  ): JSONResponse<UserObject> {
    const userObject = <UserObject>get(req, 'user', {});

    return this.responseService.jsonFormat<UserObject>('Logged in', userObject);
  }

  @ApiOperation({
    description: 'Sign up an account',
  })
  @ApiBody({
    type: UserDTO,
  })
  @Post('signup')
  async signup(@Body() userDTO: UserDTO): Promise<JSONResponse<UserObject>> {
    const userObject = await this.accountService.singup(userDTO);

    return this.responseService.jsonFormat<UserObject>(
      'Account created',
      userObject,
    );
  }
}
