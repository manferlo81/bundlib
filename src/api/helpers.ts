export const keys: (
  <K extends string | number | symbol>(
    object: Partial<Record<K, unknown>>,
  ) => Array<K extends string ? K : string>
  // eslint-disable-next-line @typescript-eslint/unbound-method
) = Object.keys

export function setProp<V>(name: string, value: V, target: Record<string, V>): Record<string, V> {
  target[name] = value
  return target
}

export function createObject<K extends string, V>(names: K[], value: V): Record<K, V> {
  return names.reduce((result, key) => (
    setProp(key, value, result)
  ), {} as Record<K, V>)
}
