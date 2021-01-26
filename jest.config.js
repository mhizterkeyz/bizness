module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 1,
  coverageDirectory: './coverage/jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@filters/(.*)': '<rootDir>/filters/$1',
    '@exceptions/(.*)': '<rootDir>/exceptions/$1',
    '@config/(.*)': '<rootDir>/config/$1',
    '@database/(.*)': '<rootDir>/database/$1',
    '@contants/(.*)': '<rootDir>/contants/$1',
    '@user/(.*)': '<rootDir>/user/$1',
    '@account/(.*)': '<rootDir>/account/$1',
    '@auth/(.*)': '<rootDir>/auth/$1',
    '@util/(.*)': '<rootDir>/util/$1',
    '@email/(.*)': '<rootDir>/email/$1',
    '@bizness/(.*)': '<rootDir>/bizness/$1',
    '@uploader/(.*)': '<rootDir>/uploader/$1',
    '@common/(.*)': '<rootDir>/common/$1',
    '@listing/(.*)': '<rootDir>/listing/$1',
  },
};
