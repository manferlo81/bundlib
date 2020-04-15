import { BuildType, SelectiveBooleanOption } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable } from '../helper-types';
import { keys, keysToObject } from '../tools/helpers';
import { isArray, isBool, isNull, isObject } from '../type-check/type-check';
import { keysCheck } from '../validate/validate-keys';
import { ALL_KEYS, API_KEYS, isBuildTypeString, isSelectiveObjectKey, resolveTypeString, resolveTypeStringArray } from './selective';

export type BooleanBuildOptions = Record<BuildType, boolean>;

export function resolveSelectiveBoolOption(value: Nullable<SelectiveBooleanOption>, defaultValue: boolean, name: string, url: string): BooleanBuildOptions {

  if (isNull(value) || value === defaultValue) {
    return keysToObject(
      ALL_KEYS,
      defaultValue,
    );
  }

  if (value === !defaultValue) {
    return keysToObject(
      ALL_KEYS,
      !defaultValue,
    );
  }

  if (isBuildTypeString(value)) {
    return resolveTypeString(value);
  }

  const invalid = invalidOption(name, url);

  if (!isObject(value)) {
    throw invalid;
  }

  if (isArray(value)) {
    return resolveTypeStringArray(value, invalid);
  }

  if (!keysCheck(value, isSelectiveObjectKey)) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isBool(override)) {
    throw invalid;
  }

  const result: BooleanBuildOptions = keysToObject(
    ALL_KEYS,
    isNull(override) ? defaultValue : override,
  );

  if (!isNull(api)) {
    if (!isBool(api)) {
      throw invalid;
    }
    keysToObject(
      API_KEYS,
      api,
      result,
    );
  }

  keys(others).forEach((type) => {
    const value = others[type];
    if (!isNull(value)) {
      if (!isBool(value)) {
        throw invalid;
      }
      result[type] = value;
    }
  });

  return result;

}

export function normalizeBooleanOption<K extends string>(
  build: Nullable<{ [X in K]?: Nullable<boolean> }>,
  key: K,
  def: boolean,
): boolean {
  return (!build || isNull(build[key])) ? def : build[key] as boolean;
}
