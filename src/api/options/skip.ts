import { isBool } from '../type-check/basic';
import type { SelectiveSkipBuildType, SelectiveSkipOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';
import { ALL_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption } from './selective';
import type { SelectiveResolvedBoolean } from './selective';

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): SelectiveResolvedBoolean<SelectiveSkipBuildType> {
  return resolveSelectiveOption<SelectiveSkipBuildType, boolean, false>(
    value,
    false,
    isBool,
    ALL_BUILD_KEYS,
    'skip',
  );
}
