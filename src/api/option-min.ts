import { MinOption, SingleMinOptions } from "./bundlib-options";
import { MinifiableFields, MinifyOptions } from "./pkg-analized";
import setProp from "./set-prop";
import { isArray, isBool, isNull } from "./type-check";
import { Nullable } from "./types";

export function isOutputField(value: any): value is MinifiableFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser" || value === "min"
  );
}

export function isValidMinOption(value: any): value is MinOption {
  return isNull(value) || isBool(value) || isOutputField(value) || (
    isArray<MinifiableFields>(value) && value.every((item) => (
      isOutputField(item)
    ))
  );
}

export function baseMinOption(value?: boolean): MinifyOptions {
  return (["main", "module", "browser", "bin"] as MinifiableFields[]).reduce((options, field) => (
    setProp(field, !!value, options)
  ), {} as Record<MinifiableFields, boolean>);
}

export function normalizeMin(min: MinOption): MinifyOptions {
  return !min ? baseMinOption()
    : min === true ? baseMinOption(true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), baseMinOption())
        : setProp(min, true, baseMinOption());
}

export function normalizeBuildMin(
  build: Nullable<SingleMinOptions>,
  field: "main" | "module" | "browser" | "bin",
  def: MinifyOptions,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min;
}
