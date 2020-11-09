import { keys, keysToObject } from '../tools/helpers';
import { createOneOfLiteral } from '../type-check/advanced';
import { isDictionary, isNull } from '../type-check/basic';
import { keysCheck } from '../type-check/keys';
import type { ObjectSelectiveOptionsKey } from '../types/bundlib-options';
import type { Nullable, TypeCheckFunction } from '../types/helper-types';
import { populateWithAPIValue } from './populate-with-api';
import type { SelectiveResolved } from './types';

export function resolveObject<K extends string, T>(
  value: unknown,
  allKeys: K[],
  isBuildType: TypeCheckFunction<K>,
  isValidValue: TypeCheckFunction<T>,
  defaultValue: T,
  invalid: TypeError,
): SelectiveResolved<K, T> {

  if (!isDictionary(value)) {
    throw invalid;
  }

  if (!keysCheck(value, createOneOfLiteral<ObjectSelectiveOptionsKey<K>>('default', 'api'), isBuildType)) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isValidValue(override)) {
    throw invalid;
  }

  const result = keysToObject<string, T>(
    allKeys,
    isNull(override) ? defaultValue : override,
  );

  if (!isNull(api)) {

    if (!isValidValue(api)) {
      throw invalid;
    }

    populateWithAPIValue(
      api,
      result,
    );

  }

  keys(others).forEach((type) => {

    const value = others[type as never] as Nullable<T>;

    if (!isNull(value)) {

      if (!isValidValue(value)) {
        throw invalid;
      }

      result[type] = value;

    }

  });

  return result;

}
