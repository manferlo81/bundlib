export function isNull(value: unknown): value is null | undefined {
  return value == null;
}

export function isObject<V = any>(value: unknown): value is Record<keyof any, V> {
  return typeof value === "object" && !!value;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isBool(value: unknown): value is boolean {
  return value === true || value === false;
}

export const isArray = Array.isArray;
