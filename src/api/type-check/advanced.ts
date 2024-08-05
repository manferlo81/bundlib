import type { Dictionary, Nullish, TypeCheckFunction } from '../types/helper-types';
import { isDictionary, isNullish, isString } from './basic';

export function createOneOfLiteral<A extends unknown[]>(...values: A): TypeCheckFunction<A extends Array<infer T> ? T : never>;
export function createOneOfLiteral<M>(...values: M[]): TypeCheckFunction<M>;
export function createOneOfLiteral<M>(...values: M[]): TypeCheckFunction<M> {
  return (value): value is M => values.includes(value);
}

export function composeOneOf<A extends Array<TypeCheckFunction<unknown>>>(...checks: A): TypeCheckFunction<A extends Array<TypeCheckFunction<infer T>> ? T : never>;
export function composeOneOf<A extends TypeCheckFunction<unknown>>(...checks: A[]): TypeCheckFunction<A extends TypeCheckFunction<infer T> ? T : never>;
export function composeOneOf<M>(...checks: Array<TypeCheckFunction<M>>): TypeCheckFunction<M>;
export function composeOneOf<M>(...checks: Array<TypeCheckFunction<M>>): TypeCheckFunction<M> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  return <X extends M = M>(value: unknown): value is X => {
    return checks.some(
      (check) => check(value),
    );
  };
}

export const isStringOrNullish = composeOneOf<string | Nullish>(isNullish, isString);
export const isDictionaryOrNullish = composeOneOf<Readonly<Dictionary<unknown>> | Nullish>(isNullish, isDictionary);
