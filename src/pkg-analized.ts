import { BundlibPkgJson, PkgJsonModuleOutputFields, PkgJsonOutputFields } from "./pkg";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export type OutputFiles = {
  [K in PkgJsonOutputFields]: string | null;
};

export type Dependencies = Record<"runtime" | "peer", readonly string[]>;

export type MinifyOptions = {
  [K in PkgJsonModuleOutputFields]: boolean;
};

export interface BrowserOptions {
  format: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
}

export type FlagField = "extend" | "esModule" | "interop" | "equals";

export type OutputOptions = {
  [K in FlagField]: boolean;
};

export interface AnalizedPkg {
  cwd: string;
  pkg: BundlibPkgJson;
  dependencies: Dependencies;
  input: string;
  output: OutputFiles;
  sourcemap: RollupSourcemap;
  browser: BrowserOptions;
  minify: MinifyOptions;
  options: OutputOptions;
}
