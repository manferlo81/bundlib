import { keysToObject, setProp } from '../tools/helpers';
import type { BuildType, SelectiveSkipBuildType, SelectiveType } from '../types/bundlib-options';
import type { TypeCheckFunction } from '../types/helper-types';
import { populateWithAPIValue } from './object-based';
import type { SelectiveResolved } from './object-based';

export function resolveTypeStringArray<K extends BuildType>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allKeys: K[],
  invalid: TypeError
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends SelectiveSkipBuildType>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allKeys: K[],
  invalid: TypeError
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends string>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allKeys: K[],
  invalid: TypeError
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends string>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allKeys: K[],
  invalid: TypeError,
): SelectiveResolved<K, boolean> {

  return value.reduce(
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
