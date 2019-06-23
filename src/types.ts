import {
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

export type FilterablePlugins = Array<Plugin | null | false>;

export type ModuleBuildFormat = Extract<RollupModuleFormat, "cjs" | "es">;
export type BrowserBuildFormat = Extract<RollupModuleFormat, "iife" | "amd" | "umd">;

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;
