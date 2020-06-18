import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isNull } from '../type-check/basic';
import type { Nullable } from '../types/helper-types';
import type { BrowserBuildFormat } from '../types/types';

export const isBrowserFormat = composeOneOf<Nullable<BrowserBuildFormat>>(
  isNull,
  createOneOfLiteral('iife', 'amd', 'umd'),
);
