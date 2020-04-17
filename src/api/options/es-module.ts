import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { BooleanBuildOptions, resolveSelectiveOption } from './selective';
import { ALL_KEYS, isBuildTypeString } from './string-based';

export function resolveESModuleOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions<BuildType> {
  return resolveSelectiveOption(
    value,
    false,
    isBuildTypeString,
    ALL_KEYS,
    'esModule',
    'https://github.com/manferlo81/bundlib#es-module',
  );
}
