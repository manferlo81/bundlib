import { BrowserBuildFormat } from "./types";

export type ModuleField = "main" | "module" | "browser";

export interface BundlibPkgInputOptions {
  input?: string | null;
}

export interface BundlibPkgFlagOptions {
  esModule?: boolean | null;
  interop?: boolean | null;
  extend?: boolean | null;
  equals?: boolean | null;
}

export interface BundlibPkgOtherOptions {
  sourcemap?: boolean | "inline" | null;
  browser?: BrowserBuildFormat | null;
  name?: string | null;
  id?: string | null;
  globals?: Record<string, string> | string[] | null;
  min?: ModuleField | ModuleField[] | boolean | null;
}

export interface BundlibPkgRemovedOptions {
  iife?: any;
  amd?: any;
  umd?: any;
}

export type BundlibOptions =
  BundlibPkgInputOptions &
  BundlibPkgFlagOptions &
  BundlibPkgOtherOptions &
  BundlibPkgRemovedOptions;
