import type { Anything, Dictionary, Nullish } from '../types/helper-types';

export function isNullish(value: unknown): value is Nullish {
  return value == null;
}

export function isObject<T = unknown>(value: unknown): value is (Dictionary<T> | T[]) {
  return !!value && typeof value === 'object';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBool(value: unknown): value is boolean {
  return value === true || value === false;
}

interface ArrayIsArray {
  (value: unknown): value is readonly unknown[];
  (value: unknown): value is unknown[];
}

export const isArray: ArrayIsArray = Array.isArray;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function isDictionary<T extends Dictionary<Anything> = Dictionary<unknown>>(value: unknown): value is T {
  return isObject(value) && !isArray(value);
}
