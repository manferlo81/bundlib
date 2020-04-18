import { CommonJSBuildOptions } from '../../bundlib-options';
import { composeOneOf } from '../../type-check/advanced';
import { isModuleOptionKey } from './module';

export const isCJSOptionKey = composeOneOf<keyof CommonJSBuildOptions>(
  isModuleOptionKey,
  'esModule',
  'interop',
);
