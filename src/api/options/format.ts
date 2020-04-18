import { Nullable } from '../helper-types';
import { composeOneOf } from '../type-check/advanced';
import { isNull } from '../type-check/basic';
import { BrowserBuildFormat } from '../types';

export const isBrowserFormat = composeOneOf<Nullable<BrowserBuildFormat>>(
  isNull,
  'iife',
  'amd',
  'umd',
);
