import { type SelectiveResolved } from 'selective-option';
import { API_SPECIAL_KEYS, MODULE_BUILD_KEYS } from '../selective/consts';
import { resolveObjectBasedSelectiveOption } from '../selective/object-based';
import { isString } from '../type-check/basic';
import { type BuildType, type SelectiveStringOption } from '../types/bundlib-options';
import { type StrictNullable } from '../types/helper-types';

export function resolveProjectOption(value: SelectiveStringOption): SelectiveResolved<BuildType, StrictNullable<string>> {
  return resolveObjectBasedSelectiveOption<BuildType, string, null>(
    value,
    MODULE_BUILD_KEYS,
    API_SPECIAL_KEYS,
    isString,
    null,
    'project',
  );
}
