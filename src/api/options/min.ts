import { type SelectiveResolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import { type BuildType, type SelectiveBooleanOption } from '../types/bundlib-options';
import { type Nullable } from '../types/helper-types';

export const resolveMinOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolved<BuildType, boolean> => (
  resolveBoolBasedSelectiveOption<BuildType, boolean>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isBool,
    false,
    'min',
  )
);
