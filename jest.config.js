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
  },
};
