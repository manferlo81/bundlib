import { PerBuildModuleOptions } from "./bundlib-options";
import { createObject, setProp } from "./helpers";
import { isArray, isBool, isNull } from "./type-check";
import { Nullable } from "./types";

export type ModuleString = "main" | "browser" | "bin";
export type ModuleOption = Nullable<ModuleString | ModuleString[] | boolean>;

export type ModuleGlobal = Record<ModuleString, boolean>;

export function isModuleString(value: any): value is ModuleString {
  return !!value && (
    value === "main" || value === "browser" || value === "bin"
  );
}

export function isModuleOption(value: any): value is ModuleOption {
  return isNull(value) || isBool(value) || isModuleString(value) || (
    isArray<ModuleString>(value) && value.every((item) => (
      isModuleString(item)
    ))
  );
}

export function normalizeModuleOption(option: ModuleOption): ModuleGlobal {
  const keys: ModuleString[] = ["main", "browser", "bin"];
  return !option ? createObject(keys, false)
    : option === true ? createObject(keys, true)
      : isArray(option) ? option.reduce((result, field) => setProp(field, true, result), createObject(keys, false))
        : setProp(option, true, createObject(keys, false));
}

export function normalizeBuildModule(
  build: Nullable<PerBuildModuleOptions>,
  key: keyof PerBuildModuleOptions,
  field: ModuleString,
  def: ModuleGlobal,
): boolean {
  return (!build || isNull(build[key])) ? def[field] : build[key] as boolean;
}
