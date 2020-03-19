import { Dictionary, Nullable } from './helper-types'

export function isNull(value: unknown): value is (null | undefined) {
  return value == null
}

export function isObject<T = unknown>(value: unknown): value is (Dictionary<T> | T[]) {
  return !!value && typeof value === 'object'
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBool(value: unknown): value is boolean {
  return value === !!value
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export const isArray: <T = unknown>(value: unknown) => value is T[] = Array.isArray

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDictionary<T = any>(value: unknown): value is Dictionary<T> {
  return isObject(value) && !isArray(value)
}

export function isStringOrNull(value: unknown): value is Nullable<string> {
  return isNull(value) || isString(value)
}

export function isDictionaryOrNull<T = unknown>(value: unknown): value is Nullable<Dictionary<T>> {
  return isNull(value) || isDictionary<T>(value)
}
