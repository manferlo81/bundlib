import type { JestConfigWithTsJest } from 'ts-jest';
import { createDefaultPreset } from 'ts-jest';

const { COVERAGE: COVERAGE_ENV } = process.env;
const collectCoverage = COVERAGE_ENV !== 'SKIP';
const coverageOnCI = COVERAGE_ENV === 'CI';

const typescriptJestPreset = createDefaultPreset({
  tsconfig: './tsconfig-test.json',
});

const config: JestConfigWithTsJest = {
  ...typescriptJestPreset,

  clearMocks: true,

  collectCoverage,
  collectCoverageFrom: [
    'src/api/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: coverageOnCI
    ? ['text', 'json', 'clover', 'cobertura']
    : ['text', 'html'],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  cacheDirectory: 'node_modules/.cache/jest',
  verbose: true,
};

export default config;
