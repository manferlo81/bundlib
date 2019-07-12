
export function setProp<V>(name: string, value: V, target: Record<string, V>): Record<string, V> {
  target[name] = value;
  return target;
}

export function createObject<K extends string, V>(keys: K[], value: V): Record<K, V> {
  return keys.reduce((result, key) => (
    setProp(key, value, result)
  ), {} as Record<K, V>);
}
