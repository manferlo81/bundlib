import { Dictionary } from '../helper-types';

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

export const isArray: <T = unknown>(value: unknown) => value is T[] = Array.isArray;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDictionary<T extends Dictionary<any> = Dictionary<unknown>>(value: unknown): value is T {
  return isObject(value) && !isArray(value);
}
