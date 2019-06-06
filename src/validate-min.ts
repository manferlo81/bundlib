import { PkgJsonModuleOutputFields } from "./pkg";
import { isArray, isBool } from "./type-check";

export function isValidMin(value: unknown): value is PkgJsonModuleOutputFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser"
  );
}

type ValidMin = PkgJsonModuleOutputFields | PkgJsonModuleOutputFields[];

export function isValidMinOption(value: unknown): value is ValidMin {
  return isBool(value) || isValidMin(value) || (
    isArray(value) && value.every((item) => (
      isValidMin(item)
    ))
  );
}
