import { BuildType, SelectiveBooleanOption, WithMinOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isNull } from '../type-check/type-check';
import { BooleanBuildOptions, resolveSelectiveOption } from './selective';
import { ALL_KEYS, isBuildTypeString } from './string-based';

export function resolveMinOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions<BuildType> {
  return resolveSelectiveOption(
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
