import { BuildType, SelectiveTypeString } from '../bundlib-options';
import { keysToObject } from '../tools/helpers';
import { createOneOf } from '../type-check/one-of';

export const API_KEYS: ['main', 'module', 'browser'] = ['main', 'module', 'browser'];
export const ALL_KEYS = [...API_KEYS, 'bin'] as ['main', 'module', 'browser', 'bin'];

export const isBuildTypeString = createOneOf<SelectiveTypeString>(
  'main',
  'module',
  'browser',
  'bin',
  'api',
);

export const isSelectiveObjectKey = createOneOf<'default' | SelectiveTypeString>(
  'default',
  isBuildTypeString,
);

export function resolveTypeString<K extends BuildType>(value: K | 'api'): Record<K, boolean> {

  const base = keysToObject(
    ALL_KEYS,
    false,
  );

  if (value === 'api') {
    return keysToObject(
      API_KEYS,
      true,
      base,
    );
  }

  base[value] = true;
  return base;

}

export function resolveTypeStringArray<K extends BuildType>(value: Array<K | 'api'>, invalid: Error): Record<K, boolean> {
  return value.reduce(
    (result, type) => {
      if (!isBuildTypeString(type)) {
        throw invalid;
      }
      if (type === 'api') {
        keysToObject(
          API_KEYS,
          true,
          result,
        );
      } else {
        result[type] = true;
      }
      return result;
    },
    keysToObject(ALL_KEYS, false),
  );
}
