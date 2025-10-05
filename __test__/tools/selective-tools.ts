import type { BuildType } from '../../src/api';
import { API_BUILD_KEYS } from '../../src/api/selective/constants';
import type { ExtractStrict } from '../../src/api/types/helper-types';

export type GetSelectiveResultValue<K extends string, V> = (key: K, output: Record<K, V>) => V;

export function createSelectiveResult<K extends string, V>(keys: readonly K[], getValue: GetSelectiveResultValue<K, V>): Record<K, V> {
  return keys.reduce<Record<string, V>>((output, key) => {
    const value = getValue(key, output);
    return { ...output, [key]: value };
  }, {});
}

type APIBuildType = ExtractStrict<BuildType, 'main' | 'module' | 'browser'>;

export const isApiKey = (key: unknown): key is APIBuildType => API_BUILD_KEYS.includes(key as never);
