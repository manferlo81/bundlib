import { API_BUILD_KEYS } from '../../src/api/selective/consts';
import { BuildTypeForAPI } from '../../src/api/types/bundlib-options';

export type GetSelectiveResultValue<K extends string, V> = (key: K, output: Record<K, V>) => V;

export function createSelectiveResult<K extends string, V>(keys: K[], getValue: GetSelectiveResultValue<K, V>): Record<K, V> {
  return keys.reduce<Record<string, V>>((output, key) => {
    const value = getValue(key, output);
    return { ...output, [key]: value };
  }, {});
}

export const isApiKey = (key: unknown): key is BuildTypeForAPI => API_BUILD_KEYS.includes(key as never);
