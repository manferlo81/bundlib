import { BundlibPkgJson } from "./pkg";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export type MinifiableFields = "main" | "module" | "browser" | "bin";
export type MinifyOptions = Record<MinifiableFields, boolean>;

export type InputOptions = Record<"api" | "bin", string>;

export interface ESModuleBuildInfo {
  file: string;
  sourcemap: RollupSourcemap;
  min: boolean;
}

export interface CommonJSBuildInfo extends ESModuleBuildInfo {
  esModule: boolean;
  interop: boolean;
}

export interface BrowserBuildInfo extends CommonJSBuildInfo {
  format: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
  extend: boolean;
}

export interface TypesBuildInfo {
  path: string;
  equals: boolean;
}

export interface OutputOptions {
  main: CommonJSBuildInfo | null;
  module: ESModuleBuildInfo | null;
  browser: BrowserBuildInfo | null;
  bin: CommonJSBuildInfo | null;
  types: TypesBuildInfo | null;
}

export type Dependencies = Record<"runtime" | "peer" | "optional", string[] | null>;

export interface PkgAnalized {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputOptions;
  output: OutputOptions;
  dependencies: Dependencies;
  cache: string;
}
