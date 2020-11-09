import { keys, keysToObject } from '../tools/helpers';
import { isDictionary, isNull } from '../type-check/basic';
import type { Nullable, TypeCheckFunction } from '../types/helper-types';
import { populateResult } from './populate-result';
import type { SelectiveResolved } from './types';

export function resolveObject<K extends string, V, D = V>(
  value: unknown,
  allKeys: K[],
  isBuildType: TypeCheckFunction<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  invalid: TypeError,
): SelectiveResolved<K, V | D> {

  if (!isDictionary(value)) {
    throw invalid;
  }

  const result: SelectiveResolved<K, V | D> = keysToObject(
    allKeys,
    defaultValue,
  );

  const { default: override, ...others } = value;

  if (!isNull(override)) {

    if (!isValidValue(override)) {
      throw invalid;
    }

    keysToObject<K, V | D, Record<K, V | D>>(
      allKeys,
      override,
      result,
    );
  }

  keys(others).forEach((type) => {

    const value = others[type as never] as Nullable<V>;

    if (!isNull(value)) {

      if (!isValidValue(value)) {
        throw invalid;
      }

      if (
        !populateResult(
          type,
          value,
          result,
          isBuildType,
        )
      ) {
        throw invalid;
      }

    }

  });

  return result;

}
