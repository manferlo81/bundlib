import type { SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { ALL_BUILD_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import type { SelectiveSkipBuildType, SelectiveSkipOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): SelectiveResolved<SelectiveSkipBuildType, boolean> {
  return resolveBoolBasedSelectiveOption<SelectiveSkipBuildType, boolean>(
    value,
    ALL_BUILD_KEYS,
    isBool,
    false,
    'skip',
  );
}
