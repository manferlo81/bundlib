import { isString } from "./type-check";
import { BrowserBuildFormat } from "./types";

export function isBrowserFormat(value: string): value is BrowserBuildFormat {
  return value === "iife" || value === "amd" || value === "umd";
}

export function validateBrowserFormat(format: unknown): BrowserBuildFormat | null {
  return (isString(format) && isBrowserFormat(format)) ? format : null;
}
