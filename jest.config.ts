import type { Config } from 'jest';

const config: Config = {
  cacheDirectory: 'node_modules/.cache/jest',
  preset: 'ts-jest',

  clearMocks: true,

  collectCoverage: !process.env.SKIP_COVERAGE,
  collectCoverageFrom: [
    'src/api/**/*.ts',
    '!src/api/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: process.env.CI
    ? ['json', 'clover', 'cobertura']
    : ['html', 'text'],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  verbose: true,
};

export default config;
