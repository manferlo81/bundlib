import { BuildType, SelectiveStringOption } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable, StrictNullable } from '../helper-types';
import { keys, keysToObject } from '../helpers';
import { isNull, isObject, isString, isStringOrNull } from '../type-check/type-check';
import { keysCheck } from '../validate/validate-keys';
import { ALL_KEYS, API_KEYS, isSelectiveObjectKey } from './selective';

export type StringBuildOptions = Record<BuildType, StrictNullable<string>>;

export function resolveSelectiveStringOption(value: Nullable<SelectiveStringOption>, optionName: string, url: string): StringBuildOptions {

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
