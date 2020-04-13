import { Nullable } from '../helper-types';
import { createOneOf } from '../type-check/one-of';
import { isNull } from '../type-check/type-check';
import { BrowserBuildFormat } from '../types';

export const isBrowserFormat = createOneOf<Nullable<BrowserBuildFormat>>(
  isNull,
  'iife',
  'amd',
  'umd',
);
