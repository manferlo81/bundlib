import {
  IsExternal,
  ModuleFormat as RollupModuleFormat,
  OutputOptions as RollupOutputOptions,
  Plugin,
  RollupOptions,
} from "rollup";

export type OutputExtra = Omit<
  RollupOutputOptions,
  "file" | "format" | "sourcemap" | "esModule" | "interop"
>;
export type ConfigExtra = Omit<
  RollupOptions,
  "input" | "output" | "external" | "plugins"
>;

export type RollupSourcemap = boolean | "inline";

export type FilterablePlugins = Array<Plugin | null | undefined | false>;

export type ModuleBuildFormat = Extract<RollupModuleFormat, "cjs" | "es">;
export type BrowserBuildFormat = Extract<RollupModuleFormat, "iife" | "amd" | "umd">;

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
}
