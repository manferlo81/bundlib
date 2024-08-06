import { keys } from '../tools/helpers';
import { isNullish, isObject, isString } from '../type-check/basic';
import { isArray } from '../type-check/is-array';
import type { GlobalsOptions } from '../types/bundlib-options';

export function isValidGlobals(value: unknown): value is GlobalsOptions {
  if (isNullish(value)) return true;
  if (!isObject(value)) return false;
  if (isArray(value)) return value.every((item) => isString(item));
  return keys(value).every((key) => {
    return isString(key) && isString(value[key]);
  });
}

export function normalizeGlobals(globals: GlobalsOptions): Record<string, string> | null {
  if (!globals) return null;
  if (!isArray(globals)) return globals;
  return globals.reduce<Record<string, string>>((result, value) => {
    return { ...result, [value]: value };
  }, {});
}
