import { CommonJSBuildOptions } from '../bundlib-options';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isModuleOptionKey } from './module';

export const isCJSOptionKey = composeOneOf<keyof CommonJSBuildOptions>(
  isModuleOptionKey,
  createOneOfLiteral<'esModule' | 'interop'>(
    'esModule',
    'interop',
  ),
);
