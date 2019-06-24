import { PkgJsonModuleOutputFields } from "./pkg";
import { isArray, isBool } from "./type-check";

export function isValidMin(value: unknown): value is PkgJsonModuleOutputFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser"
  );
}

type ValidMin = PkgJsonModuleOutputFields | PkgJsonModuleOutputFields[] | boolean;

export function isValidMinOption(value: any): value is ValidMin {
  return isBool(value) || isValidMin(value) || (
    isArray<PkgJsonModuleOutputFields>(value) && value.every((item) => (
      isValidMin(item)
    ))
  );
}
