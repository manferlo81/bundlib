import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { MODULE_BUILD_KEYS } from '../selective/consts';
import type { SelectiveResolvedBoolean } from '../selective/types';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveBooleanOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';

export const resolveInteropOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveBoolBasedSelectiveOption<BuildType, boolean>(
    value,
    MODULE_BUILD_KEYS,
    isBool,
    false,
    'interop',
  )
);
