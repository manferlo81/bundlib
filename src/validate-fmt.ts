import { BrowserBuildFormat } from "./types";

export function isBrowserFormat(value: unknown): value is BrowserBuildFormat {
  return !!value && (
    value === "iife" || value === "amd" || value === "umd"
  );
}

export function validateBrowserFormat(
  format: unknown,
  defaultFormat: BrowserBuildFormat,
): BrowserBuildFormat {

  return isBrowserFormat(format)
    ? format
    : defaultFormat;

}
