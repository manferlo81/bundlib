import { createOneOfLiteral } from '../../type-check/advanced';
import type { BrowserBuildOptions } from '../../types/bundlib-options';
import { CJS_OPTOIN_KEYS } from './main-and-bin';

export const isBrowserOption = createOneOfLiteral<keyof BrowserBuildOptions>(
  CJS_OPTOIN_KEYS,
  'format',
  'name',
  'id',
  'extend',
  'globals',
);
