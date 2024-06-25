import { createOneOfLiteral } from '../../type-check/advanced';
import { DeprecatedBrowserBuildOptions } from '../../types/deprecated-options';
import { CJS_OPTION_KEYS } from './main-and-bin';

export const isBrowserOption = createOneOfLiteral<keyof DeprecatedBrowserBuildOptions>(
  CJS_OPTION_KEYS,
  'format',
  'name',
  'id',
  'extend',
  'globals',
);
