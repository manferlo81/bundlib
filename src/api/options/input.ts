import type { SelectiveResolved } from 'selective-option';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { resolveValueBasedSelectiveOption } from '../selective/object-based';
import { isString } from '../type-check/basic';
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options';
import type { AllowNull } from '../types/helper-types';

export const resolveInputOption = (value: SelectiveStringOption): SelectiveResolved<BuildType, AllowNull<string>> => (
  resolveValueBasedSelectiveOption<BuildType, string, null>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isString,
    null,
    'input',
  )
);
