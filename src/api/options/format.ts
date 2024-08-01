import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isNullish } from '../type-check/basic';
import type { AllowNullish } from '../types/helper-types';
import type { BrowserBuildFormat } from '../types/rollup';

export const isBrowserFormat = composeOneOf<AllowNullish<BrowserBuildFormat>>(
  isNullish,
  createOneOfLiteral('iife', 'amd', 'umd'),
);
