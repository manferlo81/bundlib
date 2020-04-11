import { BuildType, SelectiveMin, WithMinOption } from '../bundlib-options';
import { error } from '../errors';
import { Nullable } from '../helper-types';
import { keysToObject } from '../helpers';
import { isArray, isNull } from '../type-check/type-check';
import { ALL_KEYS, isBuildTypeString, resolveTypeString, resolveTypeStringArray } from './selective';

interface MinBuildOptions {
  main: boolean;
  module: boolean;
  browser: boolean;
  bin: boolean;
}

export function resolveSelectiveMinOption(value: Nullable<SelectiveMin>): MinBuildOptions {

  if (isNull(value) || value === false) {
    return keysToObject(
      ALL_KEYS,
      false,
    );
  }

  if (value === true) {
    return keysToObject(
      ALL_KEYS,
      true,
    );
  }

  if (isBuildTypeString(value)) {
    return resolveTypeString(value);
  }

  const invalid = () => error('Invalid "min" option. Please check the documentation at https://github.com/manferlo81/bundlib#min');

  if (!isArray(value)) {
    throw invalid();
  }

  return resolveTypeStringArray(value, invalid);

}

export function normalizeBuildMin(
  build: Nullable<WithMinOption>,
  field: BuildType,
  def: MinBuildOptions,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min;
}
