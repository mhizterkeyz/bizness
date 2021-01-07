export interface Configuration {
  env: string;
  port: number;
  isTest: boolean;
  database: {
    url: string;
  };
}

export default (): Configuration => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  isTest: process.env.NODE_ENV === 'test',
  database: {
    url: process.env.DB_URL
  }
});
