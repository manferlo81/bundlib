import { keys } from '../tools/helpers';
import type { Dictionary, AllowNull, TypeCheckFunction } from '../types/helper-types';
import { composeOneOf } from './advanced';

export function invalidKeys<K extends string>(object: Dictionary<unknown>, list: K[]): AllowNull<K[]>;
export function invalidKeys(object: Dictionary<unknown>, list: string[]): AllowNull<string[]> {
  const invalid = keys(object).filter(
    (key) => !list.includes(key),
  );
  return invalid.length ? invalid : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function keysCheck<M extends string>(obj: Dictionary<any>, ...checks: Array<TypeCheckFunction<M>>): obj is Record<M, unknown> {
  const predicate = checks.length === 1 ? checks[0] : composeOneOf(...checks);
  return keys(obj).every(predicate);
}
