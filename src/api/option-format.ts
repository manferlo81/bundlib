import { isNull } from "./type-check";
import { BrowserBuildFormat, Nullable } from "./types";

export function isBrowserFormat(value: any): value is Nullable<BrowserBuildFormat> {
  return isNull(value) || (
    value === "iife" || value === "amd" || value === "umd"
  );
}
