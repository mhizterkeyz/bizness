import { FilterQuery } from 'mongoose';
import * as pluralize from 'mongoose-legacy-pluralize';
import { isEmpty, merge } from 'lodash';
import { BIZNESSRATING, USER } from '@constants/index';
import { Coordinates } from '@user/interfaces';
import { Bizness, BiznessListSortBy } from './interfaces';

export interface AggregationCoordinates {
  longitude: string | number;
  latitude: string | number;
}
export const getDistanceAggregation = (
  coordinates1: AggregationCoordinates,
  coordinates2: AggregationCoordinates,
): Record<string, unknown> => {
  const RadiusOfTheEarthKM = 6371;
  const { longitude: longitude1, latitude: latitude1 } = coordinates1;
  const { longitude: longitude2, latitude: latitude2 } = coordinates2;
  const dLatBy2 = {
    $divide: [{ $degreesToRadians: { $subtract: [latitude2, latitude1] } }, 2],
  };
  const dLonBy2 = {
    $divide: [
      { $degreesToRadians: { $subtract: [longitude2, longitude1] } },
      2,
    ],
  };
  const a = {
    $add: [
      { $multiply: [{ $sin: dLatBy2 }, { $sin: dLatBy2 }] },
      {
        $multiply: [
          {
            $multiply: [
              { $cos: { $degreesToRadians: latitude1 } },
              { $cos: { $degreesToRadians: latitude2 } },
            ],
          },
          { $multiply: [{ $sin: dLonBy2 }, { $sin: dLonBy2 }] },
        ],
      },
    ],
  };

  return {
    $multiply: [
      RadiusOfTheEarthKM,
      {
        $multiply: [
          2,
          { $atan2: [{ $sqrt: a }, { $sqrt: { $subtract: [1, a] } }] },
        ],
      },
    ],
  };
};

export const listUserBiznessAggregation = (
  $match: FilterQuery<Bizness>,
  search?: string,
  coordinates?: Coordinates,
  sortBy?: string,
): any[] => {
  const aggregate = [];
  const projectStage: any = {
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
    },
  };
  let sortStage = {
    $sort: {
      rating: -1,
      createdAt: -1,
      distance: 1,
    },
  };

  $match.isDeleted = false;

  if (!isEmpty(search)) {
    const regexQuery = { $regex: search, $options: 'i' };

    merge($match, { $or: [{ name: regexQuery }, { address: regexQuery }] });
  }
  if (!isEmpty(coordinates)) {
    projectStage.$project.distance = 1;
    aggregate.push({
      $addFields: {
        distance: getDistanceAggregation(coordinates, {
          latitude: '$coordinates.latitude',
          longitude: '$coordinates.longitude',
        }),
      },
    });
  }
  if (!isEmpty(sortBy)) {
    if (sortBy === BiznessListSortBy.DateCreated) {
      sortStage = {
        $sort: {
          createdAt: -1,
          distance: 1,
          rating: -1,
        },
      };
    }
    if (sortBy === BiznessListSortBy.Distance) {
      sortStage = {
        $sort: {
          distance: 1,
          rating: -1,
          createdAt: -1,
        },
      };
    }
    if (sortBy === BiznessListSortBy.Rating) {
      sortStage = {
        $sort: {
          rating: -1,
          distance: 1,
          createdAt: -1,
        },
      };
    }
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
      {
        $addFields: {
          rating: {
            $divide: [
              { $sum: '$rating.rating' },
              {
                $cond: [
                  { $gt: [{ $size: '$rating' }, 0] },
                  { $size: '$rating' },
                  1,
                ],
              },
            ],
          },
        },
      },
      sortStage,
      projectStage,
    ],
  );

  return aggregate;
};
