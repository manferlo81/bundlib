import { MODULE_BUILD_KEYS } from '../selective/consts';
import { resolveObjectBasedSelectiveOption } from '../selective/object-based';
import type { SelectiveResolved } from 'selective-option';
import { isString } from '../type-check/basic';
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options';
import type { StrictNullable } from '../types/helper-types';

export function resolveProjectOption(value: SelectiveStringOption): SelectiveResolved<BuildType, StrictNullable<string>> {
  return resolveObjectBasedSelectiveOption<BuildType, string, null>(
    value,
    MODULE_BUILD_KEYS,
    isString,
    null,
    'project',
  );
}
