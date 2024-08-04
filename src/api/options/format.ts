import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isNullish } from '../type-check/basic';
import type { AllowNullish } from '../types/helper-types';
import type { BrowserBuildFormat } from '../types/rollup';

const isBrowserFormat = createOneOfLiteral<BrowserBuildFormat>('iife', 'amd', 'umd');

export const isBrowserFormatOrNullish = composeOneOf<AllowNullish<BrowserBuildFormat>>(
  isNullish,
  isBrowserFormat,
);
