import { TypeCastCheckFunction, TypeCheckFunction } from '../helper-types';

export function createEqualsCheck<M>(expected: M, loose?: boolean): TypeCheckFunction<M> {
  return loose
    ? (value: unknown): value is M => (value == expected)
    : (value: unknown): value is M => (value === expected);
}

export function createOneOfLiteral<M>(...model: M[]): TypeCheckFunction<M> {
  return (value: unknown): value is M => (
    model.some(
      (expected) => (value === expected),
    )
  );
}

export function composeOneOf<M>(...checks: Array<TypeCheckFunction<M>>): TypeCastCheckFunction<M> {
  return <X = M>(value: unknown): value is X => checks.some(
    (check) => check(value),
  );
}
