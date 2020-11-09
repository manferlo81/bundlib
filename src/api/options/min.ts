import { MODULE_BUILD_KEYS } from '../selective/consts';
import { resolveBoolBasedSelectiveOption } from '../selective/selective';
import type { SelectiveResolvedBoolean } from '../selective/types';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveBooleanOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';

export const resolveMinOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveBoolBasedSelectiveOption<BuildType, boolean>(
    value,
    MODULE_BUILD_KEYS,
    isBool,
    false,
    'min',
  )
);
