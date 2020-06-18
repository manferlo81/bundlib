import { createOneOfLiteral } from '../../type-check/advanced';
import type { ESModuleBuildOptions } from '../../types/bundlib-options';

export const MODULE_OPTION_KEYS = [
  'sourcemap' as const,
  'min' as const,
];

export const isModuleOptionKey = createOneOfLiteral<keyof ESModuleBuildOptions>(MODULE_OPTION_KEYS);
