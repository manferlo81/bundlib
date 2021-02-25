export const keys: (
  <K extends string | number | symbol>(
    object: Partial<Record<K, unknown>>,
  ) => Array<K extends string ? K : string>
  // eslint-disable-next-line @typescript-eslint/unbound-method
) = Object.keys;

// eslint-disable-next-line @typescript-eslint/unbound-method
export const hasOwn = Object.prototype.hasOwnProperty;

export function setProp<K extends string, V>(name: K, value: V, target: Record<K, V>): Record<K, V> {
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
