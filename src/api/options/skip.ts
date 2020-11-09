import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { ALL_BUILD_KEYS } from '../selective/consts';
import type { SelectiveResolvedBoolean } from '../selective/types';
import { isBool } from '../type-check/basic';
import type { SelectiveSkipBuildType, SelectiveSkipOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): SelectiveResolvedBoolean<SelectiveSkipBuildType> {
  return resolveBoolBasedSelectiveOption<SelectiveSkipBuildType, boolean>(
    value,
    ALL_BUILD_KEYS,
    isBool,
    false,
    'skip',
  );
}
