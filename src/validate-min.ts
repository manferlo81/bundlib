import { ModuleOutputFields } from "./pkg-analized";
import { isArray, isBool } from "./type-check";

export function isValidMin(value: unknown): value is ModuleOutputFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser"
  );
}

type ValidMin = ModuleOutputFields | ModuleOutputFields[] | boolean;

export function isValidMinOption(value: any): value is ValidMin {
  return isBool(value) || isValidMin(value) || (
    isArray<ModuleOutputFields>(value) && value.every((item) => (
      isValidMin(item)
    ))
  );
}
