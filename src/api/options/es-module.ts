import type { SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { MODULE_BUILD_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveBooleanOption } from '../types/bundlib-options';
import type { Nullable } from '../types/helper-types';

export const resolveESModuleOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolved<BuildType, boolean> => (
  resolveBoolBasedSelectiveOption<BuildType, boolean>(
    value,
    MODULE_BUILD_KEYS,
    isBool,
    false,
    'esModule',
    'esmodule',
  )
);
