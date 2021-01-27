import { AggregationCoordinates } from './interfaces';

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
    $trunc: [
      {
        $multiply: [
          RadiusOfTheEarthKM,
          {
            $multiply: [
              2,
              { $atan2: [{ $sqrt: a }, { $sqrt: { $subtract: [1, a] } }] },
            ],
          },
        ],
      },
      2,
    ],
  };
};

export const getRatingAggregation = (): Record<string, unknown> => {
  return {
    $addFields: {
      rating: {
        $trunc: [
          {
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
          0,
        ],
      },
    },
  };
};
