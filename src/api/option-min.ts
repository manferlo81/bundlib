import { PerBuildMinOptions } from "./bundlib-options";
import { createObject, setProp } from "./helpers";
import { isArray, isBool, isNull } from "./type-check";
import { Nullable } from "./types";

export type MinString = "main" | "module" | "browser" | "bin";
export type MinOption = Nullable<MinString | MinString[] | boolean>;

export type MinGlobal = Record<MinString, boolean>;

export function isMinString(value: any): value is MinString {
  return value === "main" || value === "module" || value === "browser" || value === "bin";
}

export function isValidMinOption(value: any): value is MinOption {
  return isNull(value) || isBool(value) || isMinString(value) || (
    isArray<MinString>(value) && value.every((item) => (
      isMinString(item)
    ))
  );
}

export function normalizeMinOption(min: MinOption): MinGlobal {
  const keys: MinString[] = ["main", "module", "browser", "bin"];
  return !min ? createObject(keys, false)
    : min === true ? createObject(keys, true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), createObject(keys, false))
        : setProp(min, true, createObject(keys, false));
}

export function normalizeBuildMin(
  build: Nullable<PerBuildMinOptions>,
  field: MinString,
  def: MinGlobal,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min;
}
