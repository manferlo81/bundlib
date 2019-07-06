import { MinOption } from "./bundlib-options";
import { MinifyOptions, ModuleOutputFields } from "./pkg-analized";
import setProp from "./set-prop";
import { isArray, isBool, isNull } from "./type-check";

export function isOutputField(value: any): value is ModuleOutputFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser"
  );
}

export function isValidMinOption(value: any): value is MinOption {
  return isNull(value) || isBool(value) || isOutputField(value) || (
    isArray<ModuleOutputFields>(value) && value.every((item) => (
      isOutputField(item)
    ))
  );
}

export function baseMinOption(value?: boolean): MinifyOptions {
  return (["main", "module", "browser"] as ModuleOutputFields[]).reduce((options, field) => (
    setProp(field, !!value, options)
  ), {} as Record<ModuleOutputFields, boolean>);
}

export function normalizeMin(min: MinOption): MinifyOptions {
  return !min ? baseMinOption()
    : min === true ? baseMinOption(true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), baseMinOption())
        : setProp(min, true, baseMinOption());
}
