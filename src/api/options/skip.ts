import { type SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { ALL_BUILD_KEYS, API_SPECIAL_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import { type SelectiveSkipBuildType, type SelectiveSkipOption } from '../types/bundlib-options';
import { type AllowNullish } from '../types/helper-types';

export function resolveSkipOption(value: AllowNullish<SelectiveSkipOption>): SelectiveResolved<SelectiveSkipBuildType, boolean> {
  return resolveBoolBasedSelectiveOption<SelectiveSkipBuildType, boolean>(
    value,
    ALL_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isBool,
    false,
    'skip',
  );
}
