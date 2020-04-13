import { Dictionary, StrictNullable, TypeCheckFunction } from '../helper-types';
import { keys } from '../helpers';

export function invalidKeys(object: Dictionary<unknown>, list: string[]): StrictNullable<string[]> {
  const invalid = keys(object).filter(
    (key) => !list.includes(key),
  );
  return invalid.length ? invalid : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function keysCheck<M extends string>(obj: Dictionary<any>, check: TypeCheckFunction<M>): obj is Record<M, unknown> {
  return keys(obj).every(check);
}
