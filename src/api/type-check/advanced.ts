import { flattenMultilevel, MultilevelArray } from '../tools/multilevel-array';
import type { AllowNullish, Anything, Dictionary, TypeCastCheckFunction, TypeCheckFunction } from '../types/helper-types';
import { isDictionary, isNull, isString } from './basic';

export function createOneOfLiteral<M>(...values: MultilevelArray<M>): TypeCheckFunction<M> {

  const flatten = flattenMultilevel(values);

  if (flatten.length === 1) {
    const [expected] = flatten;
    return (value): value is M => value === expected;
  }

  return (value): value is M => (
    flatten.some(
      (expected) => (value === expected),
    )
  );

}

export function composeOneOf<A extends Array<TypeCheckFunction<unknown>>>(...checks: A): TypeCastCheckFunction<A extends Array<TypeCheckFunction<infer T>> ? T : never>;
export function composeOneOf<M>(...checks: Array<TypeCheckFunction<M>>): TypeCastCheckFunction<M>;
export function composeOneOf<M>(...checks: Array<TypeCheckFunction<M>>): TypeCastCheckFunction<M> {
  return <X = M>(value: unknown): value is X => checks.some(
    (check) => check(value),
  );
}

export const isStringOrNullish = composeOneOf<AllowNullish<string>>(isNull, isString);

export const isDictionaryOrNull = composeOneOf<AllowNullish<Dictionary<Anything>>>(isNull, isDictionary);
