export const keys: (
  <K extends keyof any>(
    object: Partial<Record<K, any>>,
  ) => Array<K extends string ? K : string>
) = Object.keys;

export function setProp<V>(name: string, value: V, target: Record<string, V>): Record<string, V> {
  target[name] = value;
  return target;
}

export function createObject<K extends string, V>(names: K[], value: V): Record<K, V> {
  return names.reduce((result, key) => (
    setProp(key, value, result)
  ), {} as Record<K, V>);
}
