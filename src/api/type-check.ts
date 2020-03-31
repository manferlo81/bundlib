import { Dictionary, Nullable, TypeCheckFunction } from './helper-types';

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

export function isDictionary<T = unknown>(value: unknown): value is Dictionary<T> {
  return isObject(value) && !isArray(value);
}

export function isOneOf<T>(value: unknown, ...checks: Array<TypeCheckFunction<T>>): value is T;
export function isOneOf(value: unknown): boolean {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
  const { length } = args;
  for (let i = 1; i < length; i++) {
    if (args[i](value)) {
      return true;
    }
  }
  return false;
}

export const isStringOrNull = (value: unknown): value is Nullable<string> => isOneOf(value, isString, isNull);
export const isDictionaryOrNull = <T = unknown>(value: unknown): value is Nullable<Dictionary<T>> => isOneOf(
  value,
  isDictionary as TypeCheckFunction<Dictionary<T>>,
  isNull,
);
