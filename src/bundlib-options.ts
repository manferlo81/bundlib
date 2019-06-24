import { PkgJsonModuleOutputFields } from "./pkg";
import { FlagField } from "./pkg-analized";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export interface BundlibPkgInputOptions {
  input?: string | null;
}

export type BundlibPkgFlagOptions = {
  [K in FlagField]?: boolean | null;
};

export interface BundlibPkgOtherOptions {
  sourcemap?: RollupSourcemap | null;
  browser?: BrowserBuildFormat | null;
  name?: string | null;
  id?: string | null;
  globals?: Record<string, string> | string[] | null;
  min?: PkgJsonModuleOutputFields | PkgJsonModuleOutputFields[] | boolean | null;
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
