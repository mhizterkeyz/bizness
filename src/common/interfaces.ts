export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum ENV {
  Development = 'development',
  Testing = 'testing',
  Production = 'production',
}

export const ENVs = Object.values(ENV);
