module.exports = {

  testEnvironment: 'node',
  browser: false,

  cacheDirectory: 'node_modules/.cache/jest',

  preset: 'ts-jest',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/api/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    process.env.CI ? 'json' : 'lcov',
    'text',
    'text-summary',
  ],

  verbose: true,

}
