import { BrowserBuildOptions } from '../../bundlib-options';
import { composeOneOf } from '../../type-check/advanced';
import { isCJSOptionKey } from './main-and-bin';

export const isBrowserOption = composeOneOf<keyof BrowserBuildOptions>(
  isCJSOptionKey,
  'format',
  'name',
  'id',
  'extend',
  'globals',
);
