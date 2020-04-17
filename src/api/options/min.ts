import { BuildType, SelectiveBooleanOption, WithMinOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isNull } from '../type-check/type-check';
import { BooleanBuildOptions, resolveSelectiveBoolOption } from './boolean';
import { ALL_KEYS, isBuildTypeString } from './selective';

export function resolveSelectiveMinOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions<BuildType> {
  return resolveSelectiveBoolOption(
    value,
    false,
    isBuildTypeString,
    ALL_KEYS,
    'min',
    'https://github.com/manferlo81/bundlib#min',
  );
}

export function normalizeBuildMin(
  build: Nullable<WithMinOption>,
  field: BuildType,
  def: BooleanBuildOptions<BuildType>,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : !!build.min;
}
