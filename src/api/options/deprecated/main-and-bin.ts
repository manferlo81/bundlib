import { createOneOfLiteral } from '../../type-check/advanced';
import { DeprecatedCommonJSBuildOptions } from '../../types/deprecated-options';
import { MODULE_OPTION_KEYS } from './module';

export const CJS_OPTION_KEYS = [
  MODULE_OPTION_KEYS,
  'esModule' as const,
  'interop' as const,
];

export const isCJSOptionKey = createOneOfLiteral<keyof DeprecatedCommonJSBuildOptions>(CJS_OPTION_KEYS);
