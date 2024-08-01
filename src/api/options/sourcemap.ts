import type { Resolved as SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveSourcemap } from '../types/bundlib-options';
import type { RollupSourcemap, RollupSourcemapString } from '../types/rollup';

export const isSourcemapStringOption = createOneOfLiteral<RollupSourcemapString>([
  'inline',
  'hidden',
] as const);

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  isSourcemapStringOption,
  isBool,
);

export function resolveSourcemapOption(value: SelectiveSourcemap): SelectiveResolved<BuildType, RollupSourcemap> {
  return resolveBoolBasedSelectiveOption<BuildType, RollupSourcemap, true>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isSourcemapStringOption,
    true,
    'sourcemap',
  );
}
