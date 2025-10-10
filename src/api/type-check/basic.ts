import type { NonArrayObject, Nullish, Truthy } from '../types/helper-types'
import { is } from './is'
import { isArray } from './is-array'

export function isNullish(value: unknown): value is Nullish {
  return value == null
}

export function isString(value: unknown): value is string {
  return is(value, 'string')
}

export function isBool(value: unknown): value is boolean {
  return value === true || value === false
}

export function isTruthy<V>(value: V): value is Extract<V, Truthy<V>> {
  return !!value
}

export function isObject(value: unknown): value is object {
  return !!value && is(value, 'object')
}

export function isDictionary(value: unknown): value is NonArrayObject<unknown> {
  return isObject(value) && !isArray(value)
}
