import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { Nullable, StrictNullable } from '../helper-types';
import { isString } from '../type-check/basic';
import { MODULE_BUILD_KEYS, resolveObjectBasedSelectiveOption } from './object-based';

export type ProjectBuildOptions = Record<BuildType, StrictNullable<string>>;

export function resolveProjectOption(value: Nullable<SelectiveStringOption>): ProjectBuildOptions {
  return resolveObjectBasedSelectiveOption(
    value,
    null,
    MODULE_BUILD_KEYS,
    isString,
    'project',
    'https://github.com/manferlo81/bundlib#project',
  );
}
