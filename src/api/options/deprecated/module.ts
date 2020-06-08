import { ESModuleBuildOptions } from '../../bundlib-options';
import { createOneOfLiteral } from '../../type-check/advanced';

export const MODULE_OPTION_KEYS = [
  'sourcemap' as const,
  'min' as const,
];

export const isModuleOptionKey = createOneOfLiteral<keyof ESModuleBuildOptions>(MODULE_OPTION_KEYS);
