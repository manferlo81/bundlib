import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveInteropOption } from '../types/bundlib-options';
import type { RollupBundlibInterop, RollupInteropOption } from '../types/rollup';

export const isInteropString = createOneOfLiteral<RollupInteropOption>([
  'default',
  'compat',
  'auto',
  'esModule',
  'defaultOnly',
] as const);

export const isInteropOption = composeOneOf(
  isInteropString,
  isBool,
);

export function resolveInteropOption(value: SelectiveInteropOption): Resolved<BuildType, RollupBundlibInterop> {
  return resolveBoolBasedSelectiveOption<BuildType, RollupBundlibInterop>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isInteropString,
    false as boolean,
    'interop',
  );
}
