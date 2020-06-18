import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveSourcemap } from '../types/bundlib-options';
import type { RollupSourcemap } from '../types/types';
import { MODULE_BUILD_KEYS } from './object-based';
import type { SelectiveResolved } from './object-based';
import { resolveSelectiveOption } from './selective';

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  createOneOfLiteral('inline', 'hidden'),
  isBool,
);

export const resolveSourcemapOption = (value: SelectiveSourcemap): SelectiveResolved<BuildType, RollupSourcemap> => (
  resolveSelectiveOption<BuildType, RollupSourcemap, true>(
    value,
    true,
    isSourcemapOption,
    MODULE_BUILD_KEYS,
    'sourcemap',
  )
);
