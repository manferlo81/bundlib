import { FlagField, ModuleOutputFields } from "./pkg-analized";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export interface BundlibPkgInputOptions {
  input?: string | null;
  binInput?: string | null;
}

export type BundlibPkgFlagOptions = Partial<Record<FlagField, boolean | null>>;

export interface BundlibPkgOtherOptions {
  sourcemap?: RollupSourcemap | null;
  browser?: BrowserBuildFormat | null;
  name?: string | null;
  id?: string | null;
  globals?: Record<string, string> | string[] | null;
  min?: ModuleOutputFields | ModuleOutputFields[] | boolean | null;
  cache?: string | null;
}

export type BundlibOptions =
  BundlibPkgInputOptions &
  BundlibPkgFlagOptions &
  BundlibPkgOtherOptions;
