import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { MODULE_BUILD_KEYS, isBuildTypeString } from './object-based';
import { resolveSelectiveOption, SelectivePerBuildBooleanValues } from './selective';

export function resolveInteropOption(value: Nullable<SelectiveBooleanOption>): SelectivePerBuildBooleanValues<BuildType> {
  return resolveSelectiveOption(
    value,
    false,
    isBuildTypeString,
    MODULE_BUILD_KEYS,
    'interop',
    'https://github.com/manferlo81/bundlib#interop',
  );
}
