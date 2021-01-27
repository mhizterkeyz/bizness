import { FilterQuery } from 'mongoose';
import * as pluralize from 'mongoose-legacy-pluralize';
import { isEmpty, merge } from 'lodash';
import { BIZNESSRATING, USER } from '@constants/index';
import { Coordinates } from '@common/interfaces';
import {
  getDistanceAggregation,
  getRatingAggregation,
} from '@common/aggregations';
import { Bizness } from './interfaces';

export const listUserBiznessAggregation = (
  $match: FilterQuery<Bizness>,
  search?: string,
  coordinates?: Coordinates,
  distance?: number,
): any[] => {
  const aggregate = [];

  $match.isDeleted = false;

  if (!isEmpty(search)) {
    const regexQuery = { $regex: search, $options: 'i' };

    merge($match, { $or: [{ name: regexQuery }, { address: regexQuery }] });
  }
  if (!isEmpty(coordinates)) {
    aggregate.push({
      $addFields: {
        distance: getDistanceAggregation(coordinates, {
          latitude: '$coordinates.latitude',
          longitude: '$coordinates.longitude',
        }),
      },
    });
  }
  if (!isEmpty(coordinates) && distance > 0) {
    $match.distance = { $lte: distance };
  }

  aggregate.push(
    ...[
      { $match },
      {
        $lookup: {
          from: pluralize(BIZNESSRATING),
          localField: '_id',
          foreignField: 'bizness',
          as: 'rating',
        },
      },
      {
        $lookup: {
          from: pluralize(USER),
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: { path: '$owner' } },
      getRatingAggregation(),
      {
        $sort: {
          rating: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          owner: {
            $mergeObjects: [
              {
                id: '$owner._id',
                email: '$owner.email',
                name: '$owner.name',
                username: '$owner.username',
              },
            ],
          },
          id: '$_id',
          rating: 1,
          address: 1,
          name: 1,
          createdAt: 1,
          updatedAt: 1,
          distance: 1,
        },
      },
    ],
  );

  return aggregate;
};
