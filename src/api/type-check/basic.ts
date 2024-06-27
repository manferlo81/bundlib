import type { Dictionary } from '../types/helper-types';

export function isNull(value: unknown): value is null | undefined {
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
  <T = unknown>(value: unknown): value is T[];
};

export const isArray: ArrayIsArray = Array.isArray;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDictionary<T extends Dictionary<any> = Dictionary<unknown>>(value: unknown): value is T {
  return isObject(value) && !isArray(value);
}
