import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, FilterQuery, Types } from 'mongoose';

import { BIZNESS, BIZNESSRATING } from '@constants/index';
import { User } from '@user/interfaces';
import {
  AggregatePaginationResult,
  PaginationService,
} from '@util/pagination.service';
import { Bizness, BiznessRating, JSONBizness } from './interfaces';
import {
  BiznessDTO,
  ListBiznessDTO,
  ListUserBiznessDTO,
  RateBiznessDTO,
  UpdateBiznessDTO,
} from './dtos/bizness.dto';
import { listUserBiznessAggregation } from './bizness.aggregations';

@Injectable()
export class BiznessService {
  constructor(
    @Inject(BIZNESS) private readonly biznessModel: Model<Bizness>,
    @Inject(BIZNESSRATING)
    private readonly biznessRatingModel: Model<BiznessRating>,

    private readonly paginationService: PaginationService,
  ) {}

  async createSingleBizness(
    user: User,
    biznessDTO: BiznessDTO,
  ): Promise<Bizness> {
    return this.biznessModel.create({
      owner: user.id,
      ...biznessDTO,
    });
  }

  async getSingleBizness(_id: string): Promise<JSONBizness> {
    const aggregation = listUserBiznessAggregation({
      _id: Types.ObjectId(_id),
    });
    const [bizness] = await this.biznessModel.aggregate<JSONBizness>(
      aggregation,
    );

    if (!bizness) {
      throw new NotFoundException('Bizness not found');
    }

    return bizness;
  }

  async listUserBizness(
    user: User,
    listUserBiznessDTO: ListUserBiznessDTO,
  ): Promise<AggregatePaginationResult<JSONBizness>> {
    const { search = '', page = 1, limit = 10, sortBy } = listUserBiznessDTO;
    const _id: unknown = Types.ObjectId(user.id);
    const $match: FilterQuery<Bizness> = {
      owner: _id,
    };
    const aggregation = listUserBiznessAggregation(
      $match,
      search,
      null,
      sortBy,
    );

    return this.paginationService.aggregatePaginate<JSONBizness, Bizness>(
      this.biznessModel,
      aggregation,
      {
        page,
        limit,
      },
    );
  }

  async listBizness(
    listBiznessDTO: ListBiznessDTO,
  ): Promise<AggregatePaginationResult<JSONBizness>> {
    const {
      search = '',
      page = 1,
      limit = 10,
      latitude,
      longitude,
      sortBy,
    } = listBiznessDTO;
    let coordinates = null;
    if (latitude && longitude) {
      coordinates = { latitude, longitude };
    }
    const aggregation = listUserBiznessAggregation(
      {},
      search,
      coordinates,
      sortBy,
    );

    return this.paginationService.aggregatePaginate<JSONBizness, Bizness>(
      this.biznessModel,
      aggregation,
      {
        page,
        limit,
      },
    );
  }

  async updateBiznessDetails(
    user: User,
    _id: string,
    biznessUpdateDTO: UpdateBiznessDTO,
  ): Promise<JSONBizness> {
    const bizness = await this.findBiznessOrFail({
      _id,
      owner: user.id,
      isDeleted: false,
    });
    const { addressUpdateDTO, ...regularFields } = biznessUpdateDTO;
    const update = { ...regularFields, ...addressUpdateDTO };

    await this.biznessModel.updateOne({ _id: bizness.id }, update);
    return this.getSingleBizness(_id);
  }

  async deleteBizness(user: User, _id: string): Promise<Bizness> {
    const bizness = await this.findBiznessOrFail({
      _id,
      owner: user.id,
      isDeleted: false,
    });

    return this.biznessModel.findOneAndUpdate(
      { _id: bizness.id },
      { isDeleted: true },
      { new: true, useFindAndModify: false },
    );
  }

  async rateBizness(
    user: User,
    biznessID: string,
    rateBiznessDTO: RateBiznessDTO,
  ): Promise<JSONBizness> {
    const { rating } = rateBiznessDTO;
    const bizness = await this.findBiznessOrFail({
      _id: biznessID,
    });

    if (user.id.toString() === bizness.owner.toString()) {
      throw new BadRequestException('you cannot rate your own bizness');
    }

    await this.biznessRatingModel.findOneAndUpdate(
      {
        ratedBy: user.id,
        bizness: bizness.id,
      },
      { isDeleted: false, rating },
      { upsert: true, useFindAndModify: false, new: true },
    );

    return this.getSingleBizness(biznessID);
  }

  async getRating(user: User, bizness: string): Promise<BiznessRating> {
    const rating = await this.findRatingOrFail({ ratedBy: user.id, bizness });

    return rating.populate('bizness').execPopulate();
  }

  async findBiznessOrFail(query: FilterQuery<Bizness>): Promise<Bizness> {
    query.isDeleted = false;

    const bizness = await this.biznessModel.findOne(query);

    if (!bizness) {
      throw new NotFoundException('bizness not found');
    }

    return bizness;
  }

  async findRatingOrFail(
    query: FilterQuery<BiznessRating>,
  ): Promise<BiznessRating> {
    query.isDeleted = false;

    const rating = await this.biznessRatingModel.findOne(query);

    if (!rating) {
      throw new NotFoundException('rating not found');
    }

    return rating;
  }
}
