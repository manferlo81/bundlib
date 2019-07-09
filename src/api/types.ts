import {
  IsExternal,
  OutputOptions as RollupOutputOptions,
  Plugin,
  RollupOptions,
  WatcherOptions as RollupWatcherOptions,
} from "rollup";

export type Nullable<T> = T | null | undefined;
export type RollupSourcemap = boolean | "inline";

export type FilterablePlugins = Array<Nullable<Plugin | false>>;

export type ModuleBuildFormat = "cjs" | "es";
export type BrowserBuildFormat = "iife" | "amd" | "umd";

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

export interface BundlibRollupOutputOptions extends RollupOutputOptions {
  file: string;
  format: BundlibBuildFormat;
  sourcemap: RollupSourcemap;
  esModule: boolean;
  interop: boolean;
}

export interface BundlibRollupOptions extends RollupOptions {
  input: string;
  output: BundlibRollupOutputOptions;
  external: IsExternal;
  plugins: Plugin[];
  watch: RollupWatcherOptions;
}
