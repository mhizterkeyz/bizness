export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AggregationCoordinates {
  longitude: string | number;
  latitude: string | number;
}

export enum ENV {
  Development = 'development',
  Testing = 'testing',
  Production = 'production',
}

export const ENVs = Object.values(ENV);
