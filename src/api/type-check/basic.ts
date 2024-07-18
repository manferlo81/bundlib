import type { Anything, Dictionary, Nullish } from '../types/helper-types';

export function isNull(value: unknown): value is Nullish {
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

type ArrayIsArray = {
  <T extends unknown[]>(value: unknown): value is T;
  <T extends readonly unknown[]>(value: unknown): value is T;
  <T>(value: unknown): value is T[];
};

export const isArray: ArrayIsArray = Array.isArray;

export function isDictionary<T extends Dictionary<Anything> = Dictionary<unknown>>(value: unknown): value is T {
  return isObject(value) && !isArray(value);
}
