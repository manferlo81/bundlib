import { isString } from '../type-check/basic';
import type { BuildType, SelectiveStringOption } from '../types/bundlib-options';
import type { StrictNullable } from '../types/helper-types';
import { MODULE_BUILD_KEYS, resolveObjectBasedSelectiveOption } from './object-based';
import type { SelectiveResolved } from './object-based';

export function resolveProjectOption(value: SelectiveStringOption): SelectiveResolved<BuildType, StrictNullable<string>> {
  return resolveObjectBasedSelectiveOption<string, null>(
    value,
    null,
    isString,
    MODULE_BUILD_KEYS,
    'project',
  );
}
