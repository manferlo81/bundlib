import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isNull } from '../type-check/basic';
import type { AllowNullish } from '../types/helper-types';
import type { BrowserBuildFormat } from '../types/types';

export const isBrowserFormat = composeOneOf<AllowNullish<BrowserBuildFormat>>(
  isNull,
  createOneOfLiteral('iife', 'amd', 'umd'),
);
