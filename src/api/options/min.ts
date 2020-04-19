import { BuildType, SelectiveBooleanOption, WithMinOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isBool, isNull } from '../type-check/basic';
import { isSelectiveBuildType, MODULE_BUILD_KEYS } from './object-based';
import { resolveSelectiveOption, SelectiveResolvedBoolean } from './selective';

export const resolveMinOption = (value: Nullable<SelectiveBooleanOption>): SelectiveResolvedBoolean<BuildType> => (
  resolveSelectiveOption<BuildType, boolean>(
    value,
    false,
    isSelectiveBuildType,
    isBool,
    MODULE_BUILD_KEYS,
    'min',
    'https://github.com/manferlo81/bundlib#min',
  )
);

export function normalizeBuildMin(
  build: Nullable<WithMinOption>,
  field: BuildType,
  def: SelectiveResolvedBoolean<BuildType>,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : !!build.min;
}
