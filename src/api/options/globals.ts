import { keys } from '../tools/helpers';
import { isArray, isNull, isObject, isString } from '../type-check/basic';
import type { GlobalsOptions } from '../types/bundlib-options';
import type { AllowNullish } from '../types/helper-types';

export function isValidGlobals(value: unknown): value is GlobalsOptions {
  return isNull(value) || (
    isObject(value) && (
      isArray(value)
        ? value.every((item) => isString(item))
        : keys(value).every((key) => (
          isString(key) && isString(value[key])
        ))
    )
  );
}

export function normalizeGlobals(globals: GlobalsOptions): Record<string, string> | null {
  return !globals
    ? null
    : isArray(globals)
      ? globals.reduce<Record<string, string>>((result, value) => {
        return { ...result, [value]: value };
      }, {})
      : globals;
}

export function normalizeBuildGlobals(
  build: AllowNullish<{ globals?: GlobalsOptions }>,
  def: Record<string, string> | null,
): Record<string, string> | null {
  return (!build || isNull(build.globals)) ? def : normalizeGlobals(build.globals);
}
