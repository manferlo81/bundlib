import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { StrictNullable } from '../helper-types';
import { isString } from '../type-check/basic';
import { MODULE_BUILD_KEYS, resolveObjectBasedSelectiveOption, SelectiveResolved } from './object-based';

export function resolveProjectOption(value: SelectiveStringOption): SelectiveResolved<BuildType, StrictNullable<string>> {
  return resolveObjectBasedSelectiveOption(
    value,
    null,
    MODULE_BUILD_KEYS,
    isString,
    'project',
    'https://github.com/manferlo81/bundlib#project',
  );
}
