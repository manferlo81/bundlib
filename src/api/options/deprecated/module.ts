import { ESModuleBuildOptions } from '../../bundlib-options';
import { createOneOfLiteral } from '../../type-check/advanced';

export const MODULE_OPTION_KEYS = [
  'sourcemap' as 'sourcemap',
  'min' as 'min',
];

export const isModuleOptionKey = createOneOfLiteral<keyof ESModuleBuildOptions>(MODULE_OPTION_KEYS);
