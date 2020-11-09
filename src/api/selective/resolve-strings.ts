import { keysToObject, setProp } from '../tools/helpers';
import { isArray } from '../type-check/basic';
import type { TypeCheckFunction } from '../types/helper-types';
import { populateWithAPIValue } from './populate-with-api';
import type { SelectiveResolved } from './types';

function resolveArray<K extends string>(
  value: unknown[],
  allKeys: K[],
  isBuildType: TypeCheckFunction<K>,
  invalid: TypeError,
): SelectiveResolved<K, boolean> {
  return value.reduce<SelectiveResolved<K, boolean>>(
    (result, type) => {

      if (type === 'api') {
        return populateWithAPIValue(
          true,
          result,
        );
      }

      if (!isBuildType(type)) {
        throw invalid;
      }

      return setProp(
        type,
        true,
        result,
      );

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

  if (value === 'api') {
    return populateWithAPIValue(
      true,
      keysToObject(allKeys, false),
    );
  }

  if (isBuildType(value)) {
    return setProp(
      value,
      true,
      keysToObject(
        allKeys,
        false,
      ),
    );
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
