interface ExtendedObjectConstructor extends ObjectConstructor {
  keys: <K extends string | number>(object: Readonly<Record<K, unknown>>) => Array<K extends string ? K : `${K}`>
}

export const { keys, prototype } = Object as ExtendedObjectConstructor

// eslint-disable-next-line @typescript-eslint/unbound-method
const { hasOwnProperty } = prototype

export function hasOwn(obj: unknown, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}
