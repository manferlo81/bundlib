import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { Nullable, StrictNullable } from '../helper-types';
import { isString } from '../type-check/basic';
import { MODULE_BUILD_KEYS, resolveObjectBasedSelectiveOption, SelectivePerBuildValues } from './object-based';

export function resolveInputOption(value: Nullable<SelectiveStringOption>): SelectivePerBuildValues<BuildType, StrictNullable<string>> {
  return resolveObjectBasedSelectiveOption(
    value,
    null,
    MODULE_BUILD_KEYS,
    isString,
    'input',
    'https://github.com/manferlo81/bundlib#input',
  );
}
