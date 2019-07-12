import { PerBuildModuleOptions } from "./bundlib-options";
import setProp from "./set-prop";
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

export function baseModuleOption(value?: boolean): ModuleGlobal {
  return (["main", "browser", "bin"] as ModuleString[]).reduce((options, field) => (
    setProp(field, !!value, options)
  ), {} as ModuleGlobal);
}

export function normalizeModuleOption(option: ModuleOption): ModuleGlobal {
  return !option ? baseModuleOption()
    : option === true ? baseModuleOption(true)
      : isArray(option) ? option.reduce((result, field) => setProp(field, true, result), baseModuleOption())
        : setProp(option, true, baseModuleOption());
}

export function normalizeBuildESModule(
  build: Nullable<PerBuildModuleOptions>,
  field: ModuleString,
  def: ModuleGlobal,
): boolean {
  return (!build || isNull(build.esModule)) ? def[field] : build.esModule;
}

export function normalizeBuildInterop(
  build: Nullable<PerBuildModuleOptions>,
  field: ModuleString,
  def: ModuleGlobal,
): boolean {
  return (!build || isNull(build.interop)) ? def[field] : build.interop;
}
