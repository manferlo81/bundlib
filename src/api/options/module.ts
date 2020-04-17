import { ESModuleBuildOptions } from '../bundlib-options';
import { createOneOfLiteral } from '../type-check/advanced';

export const isModuleOptionKey = createOneOfLiteral<keyof ESModuleBuildOptions>(
  'sourcemap',
  'min',
);
