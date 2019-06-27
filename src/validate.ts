import { MinOption } from "./bundlib-options";
import { ModuleOutputFields } from "./pkg-analized";
import { isArray, isBool } from "./type-check";
import { BrowserBuildFormat } from "./types";

export function isBrowserFormat(value: unknown): value is BrowserBuildFormat {
  return !!value && (
    value === "iife" || value === "amd" || value === "umd"
  );
}

export function isOutputField(value: unknown): value is ModuleOutputFields {
  return !!value && (
    value === "main" || value === "module" || value === "browser"
  );
}

export function isValidMinOption(value: any): value is MinOption {
  return isBool(value) || isOutputField(value) || (
    isArray<ModuleOutputFields>(value) && value.every((item) => (
      isOutputField(item)
    ))
  );
}
