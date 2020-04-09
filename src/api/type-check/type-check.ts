import { Dictionary, Nullable } from '../helper-types';
import { createOneOf } from './one-of';

export function isNull(value: unknown): value is (null | undefined) {
  return value == null;
}

export function isObject<T = unknown>(value: unknown): value is (Dictionary<T> | T[]) {
  return !!value && typeof value === 'object';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBool(value: unknown): value is boolean {
  return value === !!value;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export const isArray: <T = unknown>(value: unknown) => value is T[] = Array.isArray;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDictionary<T extends Dictionary<any> = Dictionary<unknown>>(value: unknown): value is T {
  return isObject(value) && !isArray(value);
}

export const isStringOrNull = createOneOf<Nullable<string>>(isNull, isString);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDictionaryOrNull = createOneOf<Nullable<Dictionary<any>>>(isNull, isDictionary);
