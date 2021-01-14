import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LocalGuard } from '@auth/strategies/local.strategy';
import { UserDocument, UserObject } from '@user/interfaces';
import { JSONResponse, ResponseService } from '@util/response.service';
import { UserDTO } from '@user/dtos/user.dto';
import { JWTGuard } from '@auth/strategies/jwt.strategy';
import { AccountService } from './account.service';
import { LoginDTO } from './dtos/login.dto';
import {
  AccountEmailUpdateDTO,
  AccountPasswordUpdateDTO,
  AccountUpdateDTO,
  AccountUsernameUpdateDTO,
} from './dtos/account.update.dto';
import { CurrentUser } from './decorators/current.user.decorator';

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
    @Body() _loginDTO: LoginDTO,
    @CurrentUser() user: UserObject,
  ): JSONResponse<UserObject> {
    return this.responseService.jsonFormat('Logged in', user);
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

  @ApiOperation({
    description: 'get user account details',
  })
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get()
  async accountDetails(
    @CurrentUser() user: UserDocument,
  ): Promise<JSONResponse<UserObject>> {
    return this.responseService.jsonFormat<UserObject>(
      'Account details',
      user.toJSON(),
    );
  }

  @ApiOperation({
    summary: 'update account details',
  })
  @ApiBody({
    type: AccountUpdateDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Put()
  async updateAccountDetails(
    @CurrentUser() user: UserDocument,
    @Body() accountUpdateDTO: AccountUpdateDTO,
  ): Promise<JSONResponse<UserObject>> {
    const updatedUser = await this.accountService.updateAccountDetails(
      user,
      accountUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account updated',
      updatedUser.toJSON(),
    );
  }

  @ApiOperation({
    summary: 'update account email',
  })
  @ApiBody({
    type: AccountEmailUpdateDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Put('/email')
  async updateAccountEmail(
    @CurrentUser() user: UserDocument,
    @Body() accountEmailUpdateDTO: AccountEmailUpdateDTO,
  ): Promise<JSONResponse<UserObject>> {
    const updatedUser = await this.accountService.updateAccountEmail(
      user,
      accountEmailUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account email updated',
      updatedUser.toJSON(),
    );
  }

  @ApiOperation({
    summary: 'update account username',
  })
  @ApiBody({
    type: AccountUsernameUpdateDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Put('/username')
  async updateAccountUsername(
    @CurrentUser() user: UserDocument,
    @Body() accountUsernameUpdateDTO: AccountUsernameUpdateDTO,
  ): Promise<JSONResponse<UserObject>> {
    const updatedUser = await this.accountService.updateAccountUsername(
      user,
      accountUsernameUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account username updated',
      updatedUser.toJSON(),
    );
  }

  @ApiOperation({
    summary: 'update account password',
  })
  @ApiBody({
    type: AccountPasswordUpdateDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Put('/password')
  async updateAccountPassword(
    @CurrentUser() user: UserDocument,
    @Body() accountPasswordUpdateDTO: AccountPasswordUpdateDTO,
  ): Promise<JSONResponse<UserObject>> {
    const updatedUser = await this.accountService.updateAccountPassword(
      user,
      accountPasswordUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account password updated',
      updatedUser.toJSON(),
    );
  }
}
