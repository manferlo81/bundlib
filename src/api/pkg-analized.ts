import { BundlibPkgJson } from "./pkg";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export type ModuleOutputFields = "main" | "module" | "browser";
export type OutputFields = ModuleOutputFields | "bin" | "types";

export type InputFiles = Record<"api" | "bin", string>;
export type OutputFiles = Record<OutputFields, string | null>;
export type Dependencies = Record<"runtime" | "peer", readonly string[] | null>;
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
