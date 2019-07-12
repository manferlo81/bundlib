import { SingleMinOptions } from "./bundlib-options";
import setProp from "./set-prop";
import { isArray, isBool, isNull } from "./type-check";
import { Nullable } from "./types";

export type MinString = "main" | "module" | "browser" | "bin";
export type MinOption = Nullable<MinString | MinString[] | boolean>;

export type MinGlobal = Record<MinString, boolean>;

export function isMinString(value: any): value is MinString {
  return !!value && (
    value === "main" || value === "module" || value === "browser" || value === "bin"
  );
}

export function isValidMinOption(value: any): value is MinOption {
  return isNull(value) || isBool(value) || isMinString(value) || (
    isArray<MinString>(value) && value.every((item) => (
      isMinString(item)
    ))
  );
}

export function baseMinOption(value?: boolean): MinGlobal {
  return (["main", "module", "browser", "bin"] as MinString[]).reduce((options, field) => (
    setProp(field, !!value, options)
  ), {} as Record<MinString, boolean>);
}

export function normalizeMinOption(min: MinOption): MinGlobal {
  return !min ? baseMinOption()
    : min === true ? baseMinOption(true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), baseMinOption())
        : setProp(min, true, baseMinOption());
}

export function normalizeBuildMin(
  build: Nullable<SingleMinOptions>,
  field: MinString,
  def: MinGlobal,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min;
}
