import { createOneOfLiteral } from '../../type-check/advanced';
import type { BrowserBuildOptions } from '../../types/bundlib-options';
import { CJS_OPTION_KEYS } from './main-and-bin';

export const isBrowserOption = createOneOfLiteral<keyof BrowserBuildOptions>(
  CJS_OPTION_KEYS,
  'format',
  'name',
  'id',
  'extend',
  'globals',
);
