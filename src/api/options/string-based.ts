import { BuildType, SelectiveType, SelectiveSkipBuildType } from '../bundlib-options';
import { TypeCheckFunction } from '../helper-types';
import { keysToObject } from '../tools/helpers';
import { API_BUILD_KEYS, SelectiveResolved } from './object-based';

export function resolveTypeString<K extends SelectiveSkipBuildType>(
  value: SelectiveType<K>,
  allkeys: K[]
): SelectiveResolved<K, boolean>;

export function resolveTypeString<K extends BuildType>(
  value: SelectiveType<K>,
  allkeys: K[]
): SelectiveResolved<K, boolean>;

export function resolveTypeString(
  value: string,
  allkeys: string[]
): SelectiveResolved<string, boolean>;

export function resolveTypeString(
  value: string,
  allkeys: string[],
): SelectiveResolved<string, boolean> {

  const base = keysToObject(
    allkeys,
    false,
  );

  if (value === 'api') {
    return keysToObject(
      API_BUILD_KEYS,
      true,
      base,
    );
  }

  base[value] = true;
  return base;

}

export function resolveTypeStringArray<K extends SelectiveSkipBuildType>(
  value: Array<SelectiveType<K>>,
  isSelectiveTypeString: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: Error
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray<K extends BuildType>(
  value: Array<SelectiveType<K>>,
  isSelectiveTypeString: TypeCheckFunction<K>,
  allkeys: K[],
  invalid: Error
): SelectiveResolved<K, boolean>;

export function resolveTypeStringArray(
  value: string[],
  isSelectiveTypeString: TypeCheckFunction<string>,
  allkeys: string[],
  invalid: Error
): SelectiveResolved<string, boolean>;

export function resolveTypeStringArray(
  value: string[],
  isSelectiveTypeString: TypeCheckFunction<string>,
  allkeys: string[],
  invalid: Error,
): SelectiveResolved<string, boolean> {

  return value.reduce(
    (result, type) => {

      if (type === 'api') {
        return keysToObject(
          API_BUILD_KEYS,
          true,
          result,
        );
      }

      if (!isSelectiveTypeString(type)) {
        throw invalid;
      }

      result[type] = true;
      return result;

    },
    keysToObject(allkeys, false),
  );

}
