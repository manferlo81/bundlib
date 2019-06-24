import { PackageJson } from "read-pkg";
import { BundlibOptions, BundlibPkgFlagOptions } from "./bundlib-options";
import { BrowserBuildFormat } from "./types";

export type PkgJsonRelevantOutputFields = "main" | "module" | "browser" | "types" | "typings";
export type PkgJsonModuleOutputFields = Extract<PkgJsonRelevantOutputFields, "main" | "module" | "browser">;
export type PkgJsonTypesOutputFields = Extract<PkgJsonRelevantOutputFields, "types">;

export interface BundlibPkgJson extends PackageJson {
  bundlib?: BundlibOptions;
}

export type PkgJsonOutputFields = PkgJsonModuleOutputFields | PkgJsonTypesOutputFields;

export type BundlibOutputFiles = Record<PkgJsonOutputFields, string | null>;

export interface BundlibDependencies {
  runtime: readonly string[];
  peer: readonly string[];
}

export type MinifyOutOptions = Partial<Record<PkgJsonModuleOutputFields, true>>;

export interface BrowserOptions {
  format: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
}

export type FlagOptions = Record<keyof BundlibPkgFlagOptions, boolean>;

export interface AnalizedPkg {
  cwd: string;
  pkg: BundlibPkgJson;
  dependencies: BundlibDependencies;
  input: string;
  output: BundlibOutputFiles;
  sourcemap: boolean | "inline";
  browser: BrowserOptions;
  minify: MinifyOutOptions;
  options: FlagOptions;
}
