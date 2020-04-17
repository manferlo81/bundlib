import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { BooleanBuildOptions, resolveSelectiveBoolOption } from './boolean';
import { ALL_KEYS, isBuildTypeString } from './selective';

export function resolveSelectiveESModuleOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions<BuildType> {
  return resolveSelectiveBoolOption(
    value,
    false,
    isBuildTypeString,
    ALL_KEYS,
    'esModule',
    'https://github.com/manferlo81/bundlib#es-module',
  );
}
