export function isNull(value: any): value is (null | undefined) {
  return value == null;
}

export function isObject<T = any>(value: any): value is (Record<string | symbol, T> | T[]) {
  return !!value && typeof value === "object";
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isBool(value: any): value is boolean {
  return value === !!value;
}

export const isArray: <T = any>(value: any) => value is T[] = Array.isArray;

export function isDictionary<T = any>(value: any): value is Record<string | symbol, T> {
  return isObject(value) && !isArray(value);
}

export function isStringOrNull(value: any): value is (string | null | undefined) {
  return isNull(value) || isString(value);
}

export function isDictionaryOrNull<T = any>(value: any): value is (Record<string | symbol, T> | null | undefined) {
  return isNull(value) || isDictionary<T>(value);
}
