import { BuildType, SelectiveBooleanOption, WithMinOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isNull } from '../type-check/basic';
import { MODULE_BUILD_KEYS, isBuildTypeString } from './object-based';
import { resolveSelectiveOption, SelectivePerBuildBooleanValues } from './selective';

export function resolveMinOption(value: Nullable<SelectiveBooleanOption>): SelectivePerBuildBooleanValues<BuildType> {
  return resolveSelectiveOption(
    value,
    false,
    isBuildTypeString,
    MODULE_BUILD_KEYS,
    'min',
    'https://github.com/manferlo81/bundlib#min',
  );
}

export function normalizeBuildMin(
  build: Nullable<WithMinOption>,
  field: BuildType,
  def: SelectivePerBuildBooleanValues<BuildType>,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : !!build.min;
}
