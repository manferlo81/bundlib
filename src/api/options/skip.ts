import { SelectiveSkipBuildType, SelectiveSkipOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isBool } from '../type-check/basic';
import { ALL_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption, SelectiveResolvedBoolean } from './selective';

export function resolveSkipOption(value: Nullable<SelectiveSkipOption>): SelectiveResolvedBoolean<SelectiveSkipBuildType> {
  return resolveSelectiveOption<SelectiveSkipBuildType, boolean, false>(
    value,
    false,
    isBool,
    ALL_BUILD_KEYS,
    'skip',
  );
}
