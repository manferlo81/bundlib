import { isString } from "./type-check";

const validMin: string[] = ["main", "module", "browser"];

export function isValidMin(value: unknown): value is "main" | "module" | "browser" {
  return isString(value) && validMin.indexOf(value) >= 0;
}
