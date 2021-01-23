import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JWTGuard } from '@auth/strategies/jwt.strategy';
import { JSONResponse, ResponseService } from '@util/response.service';
import { CurrentUser } from '@account/decorators/current.user.decorator';
import { User } from '@user/interfaces';
import { BiznessService } from './bizness.service';
import {
  BiznessDTO,
  ListBiznessDTO,
  ListUserBiznessDTO,
  RateBiznessDTO,
  RouteIDDTO,
  UpdateBiznessDTO,
} from './dtos/bizness.dto';
import { Bizness, BiznessRating, JSONBizness } from './interfaces';

@Controller('bizness')
@ApiTags('Bizness')
export class BiznessController {
  constructor(
    private readonly biznessService: BiznessService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({ summary: 'Create a new bizness' })
  @ApiBody({ type: BiznessDTO })
  @UseGuards(JWTGuard)
  @Post()
  async createBizness(
    @CurrentUser() user: User,
    @Body() biznessDTO: BiznessDTO,
  ): Promise<JSONResponse<Bizness>> {
    const bizness = await this.biznessService.createSingleBizness(
      user,
      biznessDTO,
    );

    return this.responseService.jsonFormat('bizness created', bizness);
  }

  @ApiOperation({ summary: 'Get biznesses' })
  @ApiQuery({ type: ListBiznessDTO })
  @Get()
  async listBizness(
    @Query() listBiznessDTO: ListBiznessDTO,
  ): Promise<JSONResponse<JSONBizness[]>> {
    const { data, metadata } = await this.biznessService.listBizness(
      listBiznessDTO,
    );

    return this.responseService.jsonFormat('bizness', data, metadata);
  }

  @ApiOperation({ summary: 'Get user biznesses' })
  @ApiQuery({ type: ListUserBiznessDTO })
  @UseGuards(JWTGuard)
  @Get('user')
  async listUserBizness(
    @CurrentUser() user: User,
    @Query() listBiznessDTO: ListUserBiznessDTO,
  ): Promise<JSONResponse<JSONBizness[]>> {
    const { data, metadata } = await this.biznessService.listUserBizness(
      user,
      listBiznessDTO,
    );

    return this.responseService.jsonFormat('bizness', data, metadata);
  }

  @ApiOperation({ summary: 'Get user bizness rating' })
  @ApiParam({
    name: 'biznessID',
    required: true,
  })
  @UseGuards(JWTGuard)
  @Get(':id/rate')
  async getRating(
    @CurrentUser() user: User,
    @Param() { id }: RouteIDDTO,
  ): Promise<JSONResponse<BiznessRating>> {
    const rating = await this.biznessService.getRating(user, id);

    return this.responseService.jsonFormat('your rating', rating);
  }

  @ApiOperation({ summary: 'Rate single bizness' })
  @ApiParam({
    name: 'biznessID',
    required: true,
  })
  @ApiBody({ type: RateBiznessDTO })
  @UseGuards(JWTGuard)
  @Put(':id/rate')
  async rateSingleBizness(
    @CurrentUser() user: User,
    @Param() { id }: RouteIDDTO,
    @Body() rateBiznessDTO: RateBiznessDTO,
  ): Promise<JSONResponse<JSONBizness>> {
    const bizness = await this.biznessService.rateBizness(
      user,
      id,
      rateBiznessDTO,
    );

    return this.responseService.jsonFormat('bizness rated', bizness);
  }

  @ApiOperation({ summary: 'Get single bizness' })
  @ApiParam({
    name: 'id',
    description: 'bizness id',
    required: true,
  })
  @Get(':id')
  async getSingleBizness(
    @Param() { id }: RouteIDDTO,
  ): Promise<JSONResponse<JSONBizness>> {
    const bizness = await this.biznessService.getSingleBizness(id);

    return this.responseService.jsonFormat('bizness', bizness);
  }

  @ApiOperation({ summary: 'Update single bizness' })
  @ApiBody({ type: UpdateBiznessDTO })
  @ApiParam({
    name: 'biznessID',
    required: true,
  })
  @UseGuards(JWTGuard)
  @Put(':id')
  async updateSingleBizness(
    @CurrentUser() user: User,
    @Param() { id }: RouteIDDTO,
    @Body() updateBiznessDTO: UpdateBiznessDTO,
  ): Promise<JSONResponse<JSONBizness>> {
    const bizness = await this.biznessService.updateBiznessDetails(
      user,
      id,
      updateBiznessDTO,
    );

    return this.responseService.jsonFormat('bizness updated', bizness);
  }

  @ApiOperation({ summary: 'Delete single bizness' })
  @ApiParam({
    name: 'biznessID',
    required: true,
  })
  @UseGuards(JWTGuard)
  @Delete(':id')
  async deleteSingleBizness(
    @CurrentUser() user: User,
    @Param() { id }: RouteIDDTO,
  ): Promise<JSONResponse<Bizness>> {
    const bizness = await this.biznessService.deleteBizness(user, id);

    return this.responseService.jsonFormat('bizness deleted', bizness);
  }
}
