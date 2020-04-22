import { CommonJSBuildOptions } from '../../bundlib-options';
import { createOneOfLiteral } from '../../type-check/advanced';
import { MODULE_OPTION_KEYS } from './module';

export const CJS_OPTOIN_KEYS = [
  MODULE_OPTION_KEYS,
  'esModule' as 'esModule',
  'interop' as 'interop',
];

export const isCJSOptionKey = createOneOfLiteral<keyof CommonJSBuildOptions>(CJS_OPTOIN_KEYS);
