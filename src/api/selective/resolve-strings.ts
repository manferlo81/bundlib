import { keysToObject } from '../tools/helpers';
import { isArray } from '../type-check/basic';
import type { TypeCheckFunction } from '../types/helper-types';
import { populateResult } from './populate-result';
import type { SelectiveResolved } from './types';

function resolveArray<K extends string>(
  value: unknown[],
  allKeys: K[],
  isBuildType: TypeCheckFunction<K>,
  invalid: TypeError,
): SelectiveResolved<K, boolean> {
  return value.reduce<SelectiveResolved<K, boolean>>(
    (result, type) => {
      const r = populateResult(
        type,
        true,
        result,
        isBuildType,
      );
      if (!r) {
        throw invalid;
      }
      return r;
    },
    keysToObject(allKeys, false),
  );
}

export function resolveStrings<K extends string>(
  value: unknown,
  allKeys: K[],
  isBuildType: TypeCheckFunction<K>,
  invalid: TypeError,
): SelectiveResolved<K, boolean> | void {

  const result = populateResult(
    value,
    true,
    keysToObject(allKeys, false),
    isBuildType,
  );

  if (result) {
    return result;
  }

  if (isArray(value)) {
    return resolveArray(
      value,
      allKeys,
      isBuildType,
      invalid,
    );
  }

}
