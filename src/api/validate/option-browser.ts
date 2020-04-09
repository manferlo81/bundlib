import { BrowserBuildOptions } from '../bundlib-options';
import { createOneOf } from '../type-check/one-of';
import { isCJSOptionKey } from './option-main';

export const isBrowserOption = createOneOf<keyof BrowserBuildOptions>(
  isCJSOptionKey,
  'format',
  'name',
  'id',
  'extend',
  'globals',
);
