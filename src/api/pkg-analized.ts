import { Nullable } from "./bundlib-options";
import { BundlibPkgJson } from "./pkg";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export type ModuleOutputFields = "main" | "module" | "browser";
export type OutputFields = ModuleOutputFields | "bin" | "types";

export type InputFiles = Record<"api" | "bin", string>;
export type OutputFiles = Record<OutputFields, string | null>;
export type Dependencies = Record<"runtime" | "peer" | "optional", string[] | null>;
export type MinifyOptions = Record<ModuleOutputFields, boolean>;

export interface BrowserOptions {
  format: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
}

export type FlagField = "extend" | "esModule" | "interop" | "equals";

export type OutputOptions = Record<FlagField, boolean>;

export interface AnalizedPkg {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputFiles;
  output: OutputFiles;
  sourcemap: RollupSourcemap;
  dependencies: Dependencies;
  browser: BrowserOptions;
  minify: MinifyOptions;
  options: OutputOptions;
  cache: string;
}

// version 0.10 types

export interface ESModuleBuildInfo {
  file: string;
  sourcemap: RollupSourcemap;
  min: boolean;
}

export interface NonESModuleBuildInfo extends ESModuleBuildInfo {
  esModule: boolean;
  interop: boolean;
}

export interface CommonJSBuildInfo extends NonESModuleBuildInfo {
  equals: boolean;
}

export interface BrowserBuildInfo extends NonESModuleBuildInfo {
  format: BrowserBuildFormat;
}

export interface PkgAnalized10 {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputFiles;
  main: Nullable<CommonJSBuildInfo>;
  module: Nullable<ESModuleBuildInfo>;
  browser: Nullable<BrowserBuildInfo>;
  dependencies: Dependencies;
  cache: string;
}
