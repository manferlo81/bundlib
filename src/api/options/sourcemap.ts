import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { MODULE_BUILD_KEYS } from '../selective/consts';
import type { SelectiveResolved } from '../selective/types';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveSourcemap } from '../types/bundlib-options';
import type { RollupSourcemap } from '../types/types';

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  createOneOfLiteral('inline', 'hidden'),
  isBool,
);

export const resolveSourcemapOption = (value: SelectiveSourcemap): SelectiveResolved<BuildType, RollupSourcemap> => (
  resolveBoolBasedSelectiveOption<BuildType, RollupSourcemap, true>(
    value,
    MODULE_BUILD_KEYS,
    isSourcemapOption,
    true,
    'sourcemap',
  )
);
