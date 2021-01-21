import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { isEmpty } from 'lodash';

import { BIZNESS } from '@constants/index';
import { User } from '@user/interfaces';
import {
  PaginationResult,
  PaginationService,
} from '@src/util/pagination.service';
import { Bizness } from './interfaces';
import { BiznessDTO, ListUserBiznessDTO } from './dtos/bizness.dto';

@Injectable()
export class BiznessService {
  constructor(
    @Inject(BIZNESS) private readonly biznessModel: Model<Bizness>,

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

  async getSingleUserBizness(user: User, _id: string): Promise<Bizness> {
    const bizness = await this.getSingleBizness({ _id, owner: user.id });

    if (bizness) {
      throw new NotFoundException('bizness not found');
    }

    return bizness;
  }

  async listUserBizness(
    user: User,
    listUserBiznessDTO: ListUserBiznessDTO,
  ): Promise<PaginationResult<Bizness>> {
    const { search = '', page = 1, limit = 1 } = listUserBiznessDTO;
    const criteria: FilterQuery<Bizness> = { owner: user.id, isDeleted: false };

    if (!isEmpty(search)) {
      criteria.name = { $regex: search, $options: 'i' };
    }

    return this.paginationService.paginate<Bizness>(
      this.biznessModel,
      criteria,
      {
        page,
        limit,
      },
    );
  }

  async getSingleBizness(query: FilterQuery<Bizness>): Promise<Bizness> {
    return this.biznessModel.findOne(query);
  }
}
