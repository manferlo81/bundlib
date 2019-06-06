import { PkgJsonModuleOutputFields } from "./pkg";

export function isValidMin(value: unknown): value is PkgJsonModuleOutputFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser"
  );
}
