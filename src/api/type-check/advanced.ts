import type { TypeCheckFunction } from '../types/helper-types'
import { isDictionary, isNullish, isString } from './basic'

export function createOneOfLiteral<A extends readonly unknown[]>(...values: A): TypeCheckFunction<A[number]>
export function createOneOfLiteral<V>(...values: readonly V[]): TypeCheckFunction<V>
export function createOneOfLiteral(...values: readonly unknown[]): TypeCheckFunction<unknown> {
  return (value): value is unknown => {
    return values.includes(value)
  }
}

export function composeOneOf<A extends Array<TypeCheckFunction<unknown>>>(...checks: A): TypeCheckFunction<A extends Array<TypeCheckFunction<infer T>> ? T : never>
export function composeOneOf<F extends TypeCheckFunction<unknown>>(...checks: F[]): TypeCheckFunction<F extends TypeCheckFunction<infer T> ? T : never>
export function composeOneOf<T>(...checks: Array<TypeCheckFunction<T>>): TypeCheckFunction<T>
export function composeOneOf<T>(...checks: Array<TypeCheckFunction<T>>): TypeCheckFunction<T> {
  return (value): value is T => {
    return checks.some(
      (check) => check(value),
    )
  }
}

export const isStringOrNullish = composeOneOf(isNullish, isString)
export const isDictionaryOrNullish = composeOneOf(isNullish, isDictionary)
