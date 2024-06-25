type GetObjectKeys = <K extends string | number | symbol>(object: Partial<Record<K, unknown>>) => K[];
export const keys: GetObjectKeys = Object.keys;

// eslint-disable-next-line @typescript-eslint/unbound-method
const { hasOwnProperty } = {};

export function hasOwn_v2(obj: unknown, key: string): boolean;
export function hasOwn_v2<K extends keyof T, T>(obj: T, key: K): obj is T & Record<K, unknown>;
export function hasOwn_v2<K extends string, T>(obj: T, key: K): obj is T & Record<K, unknown>;
export function hasOwn_v2(obj: unknown, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}
