import { createOneOfLiteral } from '../../type-check/advanced';
import { DeprecatedBrowserBuildOptions } from '../../types/deprecated-options';
import { MODULE_OPTION_KEYS } from './module';

export const isBrowserOptionKey = createOneOfLiteral<keyof DeprecatedBrowserBuildOptions>([
  MODULE_OPTION_KEYS,
  'esModule' as const,
  'interop' as const,
  'format',
  'name',
  'id',
  'extend',
  'globals',
]);
