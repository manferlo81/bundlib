import { CommonJSBuildOptions } from '../bundlib-options';
import { createOneOf } from '../type-check/one-of';
import { isModuleOptionKey } from './module';

export const isCJSOptionKey = createOneOf<keyof CommonJSBuildOptions>(
  isModuleOptionKey,
  'esModule',
  'interop',
);
