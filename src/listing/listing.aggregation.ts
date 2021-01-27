import { FilterQuery } from 'mongoose';
import * as pluralize from 'mongoose-legacy-pluralize';
import { isEmpty } from 'lodash';

import { Coordinates } from '@common/interfaces';
import { BIZNESS, LISTINGRATING } from '@constants/index';
import {
  getDistanceAggregation,
  getRatingAggregation,
} from '@common/aggregations';
import { Listing } from './interfaces';

export const getListingAggregation = (
  $match: FilterQuery<Listing>,
  search?: string,
  coordinates?: Coordinates,
  distance?: number,
): any[] => {
  $match.isDeleted = false;

  const aggregate: any[] = [
    { $match },
    {
      $lookup: {
        from: pluralize(BIZNESS),
        localField: 'bizness',
        foreignField: '_id',
        as: 'bizness',
      },
    },
    { $unwind: { path: '$bizness' } },
  ];

  if (!isEmpty(search)) {
    const regexQuery = { $regex: search, $options: 'i' };

    aggregate.push({
      $match: {
        $or: [
          { name: regexQuery },
          { 'bizness.address': regexQuery },
          { 'bizness.name': regexQuery },
        ],
      },
    });
  }
  if (!isEmpty(coordinates)) {
    aggregate.push({
      $addFields: {
        distance: getDistanceAggregation(coordinates, {
          latitude: '$bizness.coordinates.latitude',
          longitude: '$bizness.coordinates.longitude',
        }),
      },
    });
  }
  if (!isEmpty(coordinates) && distance > 0) {
    aggregate.push({ $match: { distance: { $lte: distance } } });
  }

  aggregate.push(
    {
      $lookup: {
        from: pluralize(LISTINGRATING),
        as: 'rating',
        localField: '_id',
        foreignField: 'listing',
      },
    },
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
        id: '$_id',
        name: 1,
        image: 1,
        bizness: {
          $mergeObjects: [
            {
              id: '$bizness._id',
              address: '$bizness.address',
              name: '$bizness.name',
              owner: '$bizness.owner',
            },
          ],
        },
        createdAt: 1,
        updatedAt: 1,
        distance: 1,
        rating: 1,
      },
    },
  );

  return aggregate;
};
