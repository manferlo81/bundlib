import { keys } from '../tools/helpers';
import { isArray, isNullish, isObject, isString } from '../type-check/basic';
import type { GlobalsOptions } from '../types/bundlib-options';
import type { AllowNullish } from '../types/helper-types';

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

export function normalizeBuildGlobals(
  build: AllowNullish<{ globals?: GlobalsOptions }>,
  def: Record<string, string> | null,
): Record<string, string> | null {
  if (!build || isNullish(build.globals)) return def;
  return normalizeGlobals(build.globals);
}
