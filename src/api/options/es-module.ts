import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveBooleanOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';
import { MODULE_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption } from './selective';
import type { SelectiveResolvedBoolean } from './selective';

export const resolveESModuleOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveSelectiveOption<BuildType, boolean, false>(
    value,
    false,
    isBool,
    MODULE_BUILD_KEYS,
    'esModule',
    'esmodule',
  )
);
