import type { Resolved as SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { createOneOfLiteral } from '../type-check/advanced';
import type { BuildType, SelectiveSourcemapOption } from '../types/bundlib-options';
import type { RollupSourcemap, RollupSourcemapString } from '../types/rollup';

export const isSourcemapStringOption = createOneOfLiteral<RollupSourcemapString>([
  'inline',
  'hidden',
] as const);

export function resolveSourcemapOption(value: SelectiveSourcemapOption): SelectiveResolved<BuildType, RollupSourcemap> {
  return resolveBoolBasedSelectiveOption<BuildType, RollupSourcemap, true>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isSourcemapStringOption,
    true,
    'sourcemap',
  );
}
