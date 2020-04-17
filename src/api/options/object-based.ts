import { BuildType, ObjectSelectiveOptions, SelectiveStringOption, SelectiveType } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, StrictNullable } from '../helper-types';
import { keys, keysToObject } from '../tools/helpers';
import { isNull, isObject, isString, isStringOrNull } from '../type-check/basic';
import { keysCheck } from '../type-check/keys';
import { ALL_KEYS, API_KEYS, isSelectiveObjectKey } from './string-based';

export type StringBuildOptions<K extends string> = Record<K, StrictNullable<string>>;

export function resolveObjectSelectiveOption(value: ObjectSelectiveOptions<SelectiveType<BuildType>, string>, invalid: TypeError): StringBuildOptions<BuildType> {

  if (!keysCheck(value, isSelectiveObjectKey)) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isStringOrNull(override)) {
    throw invalid;
  }

  const result = keysToObject(
    ALL_KEYS,
    override || null,
  );

  if (!isNull(api)) {
    if (!isString(api)) {
      throw invalid;
    }
    keysToObject(
      API_KEYS,
      api as Nullable<string>,
      result,
    );
  }

  keys(others).forEach((type) => {
    const value = others[type];
    if (!isNull(value)) {
      if (!isString(value)) {
        throw invalid;
      }
      result[type] = value;
    }
  });

  return result;

}

export function resolveObjectBasedSelectiveOption(value: Nullable<SelectiveStringOption>, optionName: string, url: string): StringBuildOptions<BuildType> {

  if (isNull(value)) {
    return keysToObject(
      ALL_KEYS,
      null,
    );
  }

  if (isString(value)) {
    return keysToObject(
      ALL_KEYS,
      value,
    );
  }

  const invalid = invalidOption(optionName, url);

  if (!isObject(value)) {
    throw invalid;
  }

  return resolveObjectSelectiveOption(
    value,
    invalid,
  );

}
