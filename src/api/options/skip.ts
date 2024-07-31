import type { Resolved as SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { ALL_BUILD_KEYS, API_SPECIAL_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import type { SelectiveSkipBuildType, SelectiveSkipOption } from '../types/bundlib-options';

export function resolveSkipOption(value: SelectiveSkipOption): SelectiveResolved<SelectiveSkipBuildType, boolean> {
  return resolveBoolBasedSelectiveOption<SelectiveSkipBuildType, boolean>(
    value,
    ALL_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isBool,
    false,
    'skip',
  );
}
