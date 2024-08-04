import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { createOneOfLiteral } from '../type-check/advanced';
import type { BuildType, SelectiveInteropOption } from '../types/bundlib-options';
import type { RollupBundlibInterop, RollupInterop } from '../types/rollup';

export const isInteropString = createOneOfLiteral<RollupInterop>([
  'default',
  'compat',
  'auto',
  'esModule',
  'defaultOnly',
]);

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
