import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveInterop } from '../types/bundlib-options';
import type { RollupBundlibInterop, RollupInteropOption } from '../types/types';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';

export const isInteropString = createOneOfLiteral<RollupInteropOption>(['default', 'compat', 'auto', 'esModule', 'defaultOnly'] as const);

export const isInteropOption = composeOneOf(
  isInteropString,
  isBool,
);

export function resolveInteropOption(value: SelectiveInterop): Resolved<BuildType, RollupBundlibInterop> {
  return resolveBoolBasedSelectiveOption<BuildType, RollupBundlibInterop>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isInteropString,
    false as boolean,
    'interop',
  );
}
