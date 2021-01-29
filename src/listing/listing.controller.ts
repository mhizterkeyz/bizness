import {
  Body,
  Controller,
  Get,
  Param,
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
import { CurrentUser } from '@account/decorators/current.user.decorator';

import { JWTGuard } from '@auth/strategies/jwt.strategy';
import { RouteIDDTO } from '@common/dtos';
import { User } from '@user/interfaces';
import { JSONResponse, ResponseService } from '@util/response.service';
import { GetListingsDTO, RateListingDTO } from './dtos/listing.dto';
import { JSONListing, ListingRating } from './interfaces';
import { ListingService } from './listing.service';

@Controller('listings')
@ApiTags('Listings')
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({ summary: 'Get bizness listings' })
  @ApiQuery({ type: GetListingsDTO })
  @Get()
  async createListing(
    @Query() getListingsDTO: GetListingsDTO,
  ): Promise<JSONResponse<JSONListing[]>> {
    const { data, metadata } = await this.listingService.getListings(
      getListingsDTO,
    );

    return this.responseService.jsonFormat('Bizness listings', data, metadata);
  }

  @ApiOperation({ summary: 'Get single bizness listing' })
  @ApiParam({
    name: 'listingID',
    required: true,
  })
  @ApiQuery({ type: GetListingsDTO })
  @Get(':id')
  async getSingleListing(
    @Param() { id }: RouteIDDTO,
    @Query() getListingDTO: GetListingsDTO,
  ): Promise<JSONResponse<JSONListing>> {
    const listing = await this.listingService.getSingleListing(
      id,
      getListingDTO,
    );

    return this.responseService.jsonFormat('Bizness listing', listing);
  }

  @ApiOperation({ summary: 'Rate single bizness listing' })
  @ApiParam({
    name: 'listingID',
    required: true,
  })
  @ApiBody({ type: RateListingDTO })
  @UseGuards(JWTGuard)
  @Put(':id/rate')
  async rateSingleListing(
    @CurrentUser() user: User,
    @Param() { id }: RouteIDDTO,
    @Body() rateListingDTO: RateListingDTO,
  ): Promise<JSONResponse<JSONListing>> {
    const listing = await this.listingService.rateListing(
      user,
      id,
      rateListingDTO,
    );

    return this.responseService.jsonFormat('Bizness listing', listing);
  }

  @ApiOperation({ summary: 'Get rating' })
  @ApiParam({
    name: 'listingID',
    required: true,
  })
  @UseGuards(JWTGuard)
  @Get(':id/rate')
  async getSingleRating(
    @CurrentUser() user: User,
    @Param() { id }: RouteIDDTO,
  ): Promise<JSONResponse<ListingRating>> {
    const rating = await this.listingService.getRating(user, id);

    return this.responseService.jsonFormat('Your rating', rating);
  }
}
