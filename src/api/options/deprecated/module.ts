import { createOneOfLiteral } from '../../type-check/advanced';
import { DeprecatedESModuleBuildOptions } from '../../types/deprecated-options';

export const MODULE_OPTION_KEYS = [
  'sourcemap' as const,
  'min' as const,
];

export const isModuleOptionKey = createOneOfLiteral<keyof DeprecatedESModuleBuildOptions>(MODULE_OPTION_KEYS);
