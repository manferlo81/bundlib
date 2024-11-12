import type { TypeCheckFunction } from '../types/helper-types';
import { isDictionary, isNullish, isString } from './basic';

export function createOneOfLiteral<V>(...values: V[]): TypeCheckFunction<V> {
  return (value): value is V => {
    return values.includes(value as never);
  };
}

export function composeOneOf<A extends Array<TypeCheckFunction<unknown>>>(...checks: A): TypeCheckFunction<A extends Array<TypeCheckFunction<infer T>> ? T : never>;
export function composeOneOf<F extends TypeCheckFunction<unknown>>(...checks: F[]): TypeCheckFunction<F extends TypeCheckFunction<infer T> ? T : never>;
export function composeOneOf<T>(...checks: Array<TypeCheckFunction<T>>): TypeCheckFunction<T>;
export function composeOneOf<T>(...checks: Array<TypeCheckFunction<T>>): TypeCheckFunction<T> {
  return (value): value is T => {
    return checks.some(
      (check) => check(value),
    );
  };
}

export const isStringOrNullish = composeOneOf(isNullish, isString);
export const isDictionaryOrNullish = composeOneOf(isNullish, isDictionary);
