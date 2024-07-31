import { createOneOfLiteral } from '../../type-check/advanced';
import { DeprecatedBrowserBuildOptions } from '../../types/deprecated-options';
import { CJS_OPTION_KEYS } from './commonjs';

export const isBrowserOptionKey = createOneOfLiteral<keyof DeprecatedBrowserBuildOptions>([
  CJS_OPTION_KEYS,
  'format',
  'name',
  'id',
  'extend',
  'globals',
]);
