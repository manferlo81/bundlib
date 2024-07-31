import type { Resolved } from 'selective-option';
import { resolveBoolBasedSelectiveOption } from '../selective/bool-based';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { isBool } from '../type-check/basic';
import type { BuildType, SelectiveBooleanOption } from '../types/bundlib-options';
import type { AllowNullish } from '../types/helper-types';

export function resolveESModuleOption(value: AllowNullish<SelectiveBooleanOption>): Resolved<BuildType, boolean> {
  return resolveBoolBasedSelectiveOption<BuildType, boolean, false>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isBool,
    false,
    'esModule',
    'esmodule',
  );
}
