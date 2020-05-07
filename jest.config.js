module.exports = {

  testEnvironment: 'node',
  browser: false,

  cacheDirectory: 'node_modules/.cache/jest',

  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/api/**/*.ts',
    '!src/api/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    process.env.CI ? 'json' : 'lcov',
    'text',
    'text-summary',
  ],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  verbose: true,

};
