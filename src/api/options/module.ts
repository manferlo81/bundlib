import { ESModuleBuildOptions } from '../bundlib-options';
import { createOneOf } from '../type-check/one-of';

export const isModuleOptionKey = createOneOf<keyof ESModuleBuildOptions>(
  'sourcemap',
  'min',
);
