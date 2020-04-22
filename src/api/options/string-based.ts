import { BuildType, SelectiveSkipBuildType, SelectiveType } from '../bundlib-options';
import { TypeCheckFunction } from '../helper-types';
import { keysToObject, setProp } from '../tools/helpers';
import { populateWithAPIValue, SelectiveResolved } from './object-based';

export function resolveTypeStringArray<K extends BuildType>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends SelectiveSkipBuildType>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends string>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: TypeError
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends string>(
  value: Array<SelectiveType<K>>,
  isBuildType: TypeCheckFunction<K>,
  allkeys: K[],
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
    keysToObject(allkeys, false),
  );

}
