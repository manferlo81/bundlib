import { BrowserBuildOptions } from '../bundlib-options';
import { isCJSOptionKey } from './main-and-bin';
import { createOneOf } from '../type-check/one-of';

export const isBrowserOption = createOneOf<keyof BrowserBuildOptions>(
  isCJSOptionKey,
  'format',
  'name',
  'id',
  'extend',
  'globals',
);
