import { flattenMultilevel, MultilevelArray } from '../tools/multilevel-array';
import type { AllowNullish, Dictionary, TypeCastCheckFunction, TypeCheckFunction } from '../types/helper-types';
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

export const composeOneOf = <M>(...checks: Array<TypeCheckFunction<M>>): TypeCastCheckFunction<M> => (
  <X = M>(value: unknown): value is X => checks.some(
    (check) => check(value),
  )
);

export const isStringOrNullish = composeOneOf<AllowNullish<string>>(isNull, isString);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDictionaryOrNull = composeOneOf<AllowNullish<Dictionary<any>>>(isNull, isDictionary);
