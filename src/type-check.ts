export function isNull(value: any): value is (null | undefined) {
  return value == null;
}

export function isObject<T>(value: any): value is Record<string | number, T> {
  return !!value && typeof value === "object";
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isBool(value: any): value is boolean {
  return value === true || value === false;
}

export const isArray: <T = any>(value: any) => value is T[] = Array.isArray;

export function isDictionary<T>(value: any): value is Record<string, T> {
  return isObject(value) && !isArray(value);
}
