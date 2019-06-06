import { BrowserBuildFormat } from "./types";

export function isBrowserFormat(value: unknown): value is BrowserBuildFormat {
  return !!value && (
    value === "iife" || value === "amd" || value === "umd"
  );
}
