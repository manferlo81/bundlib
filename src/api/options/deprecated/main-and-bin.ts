import { createOneOfLiteral } from '../../type-check/advanced';
import type { CommonJSBuildOptions } from '../../types/bundlib-options';
import { MODULE_OPTION_KEYS } from './module';

export const CJS_OPTION_KEYS = [
  MODULE_OPTION_KEYS,
  'esModule' as const,
  'interop' as const,
];

export const isCJSOptionKey = createOneOfLiteral<keyof CommonJSBuildOptions>(CJS_OPTION_KEYS);
