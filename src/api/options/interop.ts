import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isBool } from '../type-check/basic';
import { MODULE_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption, SelectiveResolvedBoolean } from './selective';

export const resolveInteropOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveSelectiveOption<BuildType, boolean, false>(
    value,
    false,
    isBool,
    MODULE_BUILD_KEYS,
    'interop',
  )
);
