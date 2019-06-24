import { BrowserBuildFormat } from "./types";

export type ModuleField = "main" | "module" | "browser";

export interface BundlibPkgInputOptions {
  input: string | null;
}

export interface BundlibPkgFlagOptions {
  esModule: boolean;
  interop: boolean;
  extend: boolean;
  equals: boolean;
}

export interface BundlibPkgOtherOptions {
  sourcemap: boolean | "inline";
  browser: BrowserBuildFormat;
  name: string;
  id: string;
  globals: Record<string, string> | string[];
  min: ModuleField | ModuleField[] | boolean | null;
}

export interface BundlibPkgRemovedOptions {
  iife: any;
  amd: any;
  umd: any;
}

export type BundlibOptions = Partial<
  BundlibPkgInputOptions &
  BundlibPkgFlagOptions &
  BundlibPkgOtherOptions &
  BundlibPkgRemovedOptions
>;
