import { BuildType, SelectiveBooleanOption, WithMinOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isNull } from '../type-check/type-check';
import { BooleanBuildOptions, resolveSelectiveBoolOption } from './boolean';

export function resolveSelectiveMinOption(value: Nullable<SelectiveBooleanOption>): BooleanBuildOptions {
  return resolveSelectiveBoolOption(
    value,
    false,
    'min',
    'https://github.com/manferlo81/bundlib#min',
  );
}

export function normalizeBuildMin(
  build: Nullable<WithMinOption>,
  field: BuildType,
  def: BooleanBuildOptions,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : !!build.min;
}
