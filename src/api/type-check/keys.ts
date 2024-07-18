import { keys } from '../tools/helpers';
import type { Dictionary, AllowNull, TypeCheckFunction, Anything } from '../types/helper-types';

export function invalidKeys<K extends string>(object: Dictionary<unknown>, list: K[]): AllowNull<K[]>;
export function invalidKeys(object: Dictionary<unknown>, list: string[]): AllowNull<string[]> {
  const invalid = keys(object).filter(
    (key) => !list.includes(key),
  );
  return invalid.length ? invalid : null;
}

export function keysCheck<M extends string>(obj: Dictionary<Anything>, check: TypeCheckFunction<M>): obj is Record<M, unknown> {
  return keys(obj).every(check);
}
