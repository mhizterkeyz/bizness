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
import { User } from '@user/interfaces';
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
import { LoggedInJSONUser } from './interfaces';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from './dtos/forgot.password.dto';

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
    @CurrentUser() user: LoggedInJSONUser,
  ): JSONResponse<LoggedInJSONUser> {
    return this.responseService.jsonFormat('Logged in', user);
  }

  @ApiOperation({
    description: 'Sign up an account',
  })
  @ApiBody({
    type: UserDTO,
  })
  @Post('signup')
  async signup(
    @Body() userDTO: UserDTO,
  ): Promise<JSONResponse<LoggedInJSONUser>> {
    const userObject = await this.accountService.singup(userDTO);

    return this.responseService.jsonFormat('Account created', userObject);
  }

  @ApiOperation({
    description: 'get user account details',
  })
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get()
  async accountDetails(@CurrentUser() user: User): Promise<JSONResponse<User>> {
    return this.responseService.jsonFormat('Account details', user);
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
    @CurrentUser() user: User,
    @Body() accountUpdateDTO: AccountUpdateDTO,
  ): Promise<JSONResponse<User>> {
    const updatedUser = await this.accountService.updateAccountDetails(
      user,
      accountUpdateDTO,
    );

    return this.responseService.jsonFormat('Account updated', updatedUser);
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
    @CurrentUser() user: User,
    @Body() accountEmailUpdateDTO: AccountEmailUpdateDTO,
  ): Promise<JSONResponse<User>> {
    const updatedUser = await this.accountService.updateAccountEmail(
      user,
      accountEmailUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account email updated',
      updatedUser,
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
    @CurrentUser() user: User,
    @Body() accountUsernameUpdateDTO: AccountUsernameUpdateDTO,
  ): Promise<JSONResponse<User>> {
    const updatedUser = await this.accountService.updateAccountUsername(
      user,
      accountUsernameUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account username updated',
      updatedUser,
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
    @CurrentUser() user: User,
    @Body() accountPasswordUpdateDTO: AccountPasswordUpdateDTO,
  ): Promise<JSONResponse<LoggedInJSONUser>> {
    const updatedUser = await this.accountService.updateAccountPassword(
      user,
      accountPasswordUpdateDTO,
    );

    return this.responseService.jsonFormat(
      'Account password updated',
      updatedUser,
    );
  }

  @ApiOperation({
    summary: 'recover forgotten passwor',
  })
  @ApiBody({
    type: ForgotPasswordDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/forgot')
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<JSONResponse<undefined>> {
    await this.accountService.forgotPassword(forgotPasswordDTO);

    return this.responseService.jsonFormat(
      'Password reset token sent to email.',
    );
  }

  @ApiOperation({
    summary: 'reset account password with reset token',
  })
  @ApiBody({
    type: ResetPasswordDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/reset')
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ): Promise<JSONResponse<LoggedInJSONUser>> {
    const user = await this.accountService.resetPassword(resetPasswordDTO);

    return this.responseService.jsonFormat('password reset successful', user);
  }
}
