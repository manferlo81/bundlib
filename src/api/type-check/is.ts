interface TypeOfMap {
  string: string
  object: object | null
}

export function is<K extends keyof TypeOfMap>(value: unknown, type: K): value is TypeOfMap[K] {
  return typeof value === type
}
