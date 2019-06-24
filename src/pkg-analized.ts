import { BundlibPkgJson, PkgJsonModuleOutputFields, PkgJsonOutputFields } from "./pkg";
import { BrowserBuildFormat, RollupSourcemap } from "./types";

export type OutputFiles = Record<PkgJsonOutputFields, string | null>;
export type Dependencies = Record<"runtime" | "peer", readonly string[]>;
export type MinifyOptions = Record<PkgJsonModuleOutputFields, boolean>;

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
  dependencies: Dependencies;
  input: string;
  output: OutputFiles;
  sourcemap: RollupSourcemap;
  browser: BrowserOptions;
  minify: MinifyOptions;
  options: OutputOptions;
}
