import { Dictionary } from '../helper-types';

export const keys: (
  <K extends string | number | symbol>(
    object: Partial<Record<K, unknown>>,
  ) => Array<K extends string ? K : string>
  // eslint-disable-next-line @typescript-eslint/unbound-method
) = Object.keys;

// eslint-disable-next-line @typescript-eslint/unbound-method
export const hasOwn = Object.prototype.hasOwnProperty;

export function setProp<V>(name: string, value: V, target: Dictionary<V>): Dictionary<V> {
  target[name] = value;
  return target;
}

export function keysToObject<K extends string, V>(keys: K[], value: V): Record<K, V>;
export function keysToObject<K extends string, V, R extends Record<K, V>>(keys: K[], value: V, result: R): R;
export function keysToObject<K extends string, V, R extends Record<K, V>>(keys: K[], value: V, result?: R): Record<K, V> {
  return keys.reduce(
    (result, key) => setProp(key, value, result),
    result || {} as Record<K, V>,
  );
}
