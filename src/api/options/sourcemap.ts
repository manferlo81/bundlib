import { type SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import { type BuildType, type SelectiveSourcemap } from '../types/bundlib-options';
import { type RollupSourcemap } from '../types/types';

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  createOneOfLiteral('inline', 'hidden'),
  isBool,
);

export const resolveSourcemapOption = (value: SelectiveSourcemap): SelectiveResolved<BuildType, RollupSourcemap> => (
  resolveBoolBasedSelectiveOption<BuildType, RollupSourcemap, true>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isSourcemapOption,
    true,
    'sourcemap',
  )
);
