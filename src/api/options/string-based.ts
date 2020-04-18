import { BuildType } from '../bundlib-options';
import { TypeCheckFunction } from '../helper-types';
import { keysToObject } from '../tools/helpers';
import { API_BUILD_KEYS } from './object-based';

export function resolveTypeString<K extends BuildType | 'types'>(value: K | 'api', allkeys: K[]): Record<K, boolean>;
export function resolveTypeString<K extends BuildType>(value: K | 'api', allkeys: K[]): Record<K, boolean>;
export function resolveTypeString(value: string, allkeys: string[]): Record<string, boolean>;
export function resolveTypeString(value: string, allkeys: string[]): Record<string, boolean> {

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

export function resolveTypeStringArray<K extends BuildType | 'types'>(value: Array<K | 'api'>, check: TypeCheckFunction<K>, allkeys: K[], invalid: Error): Record<K, boolean>;
export function resolveTypeStringArray<K extends BuildType>(value: Array<K | 'api'>, check: TypeCheckFunction<K>, allkeys: K[], invalid: Error): Record<K, boolean>;
export function resolveTypeStringArray(value: string[], check: TypeCheckFunction<string>, allkeys: string[], invalid: Error): Record<string, boolean>;
export function resolveTypeStringArray(value: string[], check: TypeCheckFunction<string>, allkeys: string[], invalid: Error): Record<string, boolean> {
  return value.reduce(
    (result, type) => {

      if (!check(type)) {
        throw invalid;
      }

      if (type === 'api') {
        return keysToObject(
          API_BUILD_KEYS,
          true,
          result,
        );
      }

      result[type] = true;
      return result;

    },
    keysToObject(allkeys, false),
  );
}
