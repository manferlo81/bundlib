import { FlagField, ModuleOutputFields } from "./pkg-analized";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export type Nullable<T> = T | null | undefined;

export interface BundlibPkgInputOptions {
  input?: Nullable<string>;
  bin?: Nullable<string>;
}

export type BundlibPkgFlagOptions = Partial<Record<FlagField, Nullable<boolean>>>;

export type GlobalsOptions = Nullable<Record<string, string> | string[]>;
export type MinOption = Nullable<ModuleOutputFields | ModuleOutputFields[] | boolean>;

export interface BundlibPkgOtherOptions {
  sourcemap?: Nullable<RollupSourcemap>;
  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  globals?: GlobalsOptions;
  min?: MinOption;
  cache?: Nullable<string>;
}

export type BundlibOptions =
  BundlibPkgInputOptions &
  BundlibPkgFlagOptions &
  BundlibPkgOtherOptions;

export type OptionName = keyof BundlibOptions;
