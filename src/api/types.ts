import {
  IsExternal,
  ModuleFormat as RollupModuleFormat,
  OutputOptions as RollupOutputOptions,
  Plugin,
  RollupOptions,
  WatcherOptions as RollupWatcherOptions,
} from "rollup";
import { Nullable } from "./bundlib-options";

type OutputExtraExcludeKeys = "file" | "format" | "sourcemap" | "esModule" | "interop";
type ConfigExtraExcludeKeys = "input" | "output" | "external" | "plugins" | "watch";

export type OutputExtra = Omit<
  RollupOutputOptions,
  OutputExtraExcludeKeys
>;

export type ConfigExtra = Omit<
  RollupOptions,
  ConfigExtraExcludeKeys
>;

export type RollupSourcemap = boolean | "inline";

export type FilterablePlugins = Array<Nullable<Plugin | false>>;

export type ModuleBuildFormat = Extract<RollupModuleFormat, "cjs" | "es">;
export type BrowserBuildFormat = Extract<RollupModuleFormat, "iife" | "amd" | "umd">;

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

export interface BundlibRollupOutputOptions extends RollupOutputOptions, Record<OutputExtraExcludeKeys, any> {
  file: string;
  format: BundlibBuildFormat;
  sourcemap: RollupSourcemap;
  esModule: boolean;
  interop: boolean;
}

export interface BundlibRollupOptions extends RollupOptions, Record<ConfigExtraExcludeKeys, any> {
  input: string;
  output: BundlibRollupOutputOptions;
  external: IsExternal;
  plugins: Plugin[];
  watch: RollupWatcherOptions;
}
