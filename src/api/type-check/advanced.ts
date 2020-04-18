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

export function composeOneOf<M>(...checkers: Array<M | TypeCheckFunction<M>>): TypeCastCheckFunction<M> {

  let consecutive: M[] | null = null;

  const flush = (checks: Array<TypeCheckFunction<M>>) => {
    if (consecutive) {
      checks.push(
        consecutive.length > 1
          ? createOneOfLiteral(...consecutive)
          : createEqualsCheck(consecutive[0]),
      );
      consecutive = null;
    }
  };

  const checks = checkers.reduce(
    (checks, checker) => {
      if (typeof checker === 'function') {
        flush(checks);
        checks.push(checker as TypeCheckFunction<M>);
      } else {
        if (!consecutive) {
          consecutive = [checker];
        } else {
          consecutive.push(checker);
        }
      }
      return checks;
    },
    [] as Array<TypeCheckFunction<M>>,
  );

  flush(checks);

  return <X = M>(value: unknown): value is X => checks.some(
    (check) => check(value),
  );

}
