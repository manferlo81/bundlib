import { isString } from "./type-check";
import { BrowserBuildFormat } from "./types";

const validBrowserFormats: string[] = ["iife", "amd", "umd"];

export function isBrowserFormat(value: string): value is BrowserBuildFormat {
  return validBrowserFormats.indexOf(value) >= 0;
}

export function validateBrowserFormat(format: unknown): BrowserBuildFormat | null {
  return (isString(format) && isBrowserFormat(format)) ? format : null;
}
