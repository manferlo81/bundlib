import type { NonArrayObject, Nullish, TypeCheckFunction } from '../types/helper-types'
import { is } from './is'
import { isArray } from './is-array'

export function isNullish(value: unknown): value is Nullish {
  return value == null
}

export const isString: TypeCheckFunction<string> = (value) => is(value, 'string')

export const isObject: TypeCheckFunction<object> = (value) => !!value && is(value, 'object')

export function isBool(value: unknown): value is boolean {
  return value === true || value === false
}

export function isDictionary(value: unknown): value is NonArrayObject<unknown> {
  return isObject(value) && !isArray(value)
}
