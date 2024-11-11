import type { Config } from 'jest';

const { COVERAGE: COVERAGE_ENV } = process.env;

const config: Config = {
  cacheDirectory: 'node_modules/.cache/jest',
  preset: 'ts-jest',

  clearMocks: true,

  collectCoverage: COVERAGE_ENV !== 'SKIP',
  collectCoverageFrom: [
    'src/api/**/*.ts',
    '!src/api/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: COVERAGE_ENV === 'CI'
    ? ['json', 'clover', 'cobertura']
    : ['html', 'text'],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  verbose: true,
};

export default config;
