import { GlobalsOptions } from "./bundlib-options";
import keys from "./obj-keys";
import setProp from "./set-prop";
import { isArray, isNull, isObject, isString } from "./type-check";
import { Nullable } from "./types";

export function isValidGlobals(value: any): value is GlobalsOptions {
  return isNull(value) || (isObject(value) && (
    isArray(value) ? value.every((item) => isString(item)) : keys(value).every((key) => (
      isString(key) && isString(value[key])
    ))
  ));
}

export function normalizeGlobals(globals: GlobalsOptions): Record<string, string> | null {
  return !globals ? null
    : isArray(globals) ? globals.reduce<Record<string, string>>((result, value) => setProp(value, value, result), {})
      : globals;
}

export function normalizeBuildGlobals(
  build: Nullable<{ globals?: GlobalsOptions }>,
  def: Record<string, string> | null,
): Record<string, string> | null {
  return (!build || isNull(build.globals)) ? def : normalizeGlobals(build.globals);
}
