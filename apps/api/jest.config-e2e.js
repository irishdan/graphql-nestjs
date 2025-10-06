module.exports = {
  testMatch: ['**/test/e2e/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: './coverage/e2e',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: '<rootDir>/test/setup.ts',
  // globalTeardown: '<rootDir>/test/teardown.ts',
};
