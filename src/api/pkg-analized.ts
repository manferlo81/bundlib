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
  output: OutputFiles;
  sourcemap: RollupSourcemap;
  browser: BrowserOptions;
  minify: MinifyOptions;
  options: OutputOptions;
}

// version 0.10 types

export interface ESModuleBuildInfo {
  file: string;
  sourcemap: RollupSourcemap;
  min?: boolean;
}

export interface ModuleBuildInfo extends ESModuleBuildInfo {
  esModule: boolean;
  interop: boolean;
}

export interface CommonJSBuildInfo extends ModuleBuildInfo {
  equals: boolean;
}

export interface BrowserBuildInfo extends ModuleBuildInfo {
  name: string | null;
  format: BrowserBuildFormat;
  extend: boolean;
}

export interface PkgAnalized10 {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputFiles;
  main: CommonJSBuildInfo | null;
  module: ESModuleBuildInfo | null;
  browser: BrowserBuildInfo | null;
  dependencies: Dependencies;
  cache: string;
  legacy: AnalizedPkg;
}
