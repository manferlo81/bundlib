import { ModuleFormat, OutputOptions as RollupOutputOptions, Plugin, RollupOptions } from "rollup";
import { BundlibBuildOptions, Pkg } from "./pkg";

export type Some<T, X extends T> = Exclude<T, Exclude<T, X>>;
export type Extra<T, X extends keyof T> = Pick<T, Exclude<keyof T, X>>;

export type OutputExtra = Extra<
  RollupOutputOptions,
  "file" | "format" | "sourcemap" | "esModule" | "interop"
>;

export type FilterablePlugins = Array<Plugin | null | false>;
export type ConfigExtra = Extra<
  RollupOptions,
  "input" | "output" | "external" | "plugins"
>;

export type BuildFormat = Some<ModuleFormat, "cjs" | "es" | "iife" | "amd" | "umd">;

export interface BundlibOptions {
  dev?: boolean;
  watch?: boolean;
}

export interface BundlibPkg {
  cwd: string;
  pkg: Pkg;
  external: string[];
  types: string | null;
  options: BundlibBuildOptions;
}
