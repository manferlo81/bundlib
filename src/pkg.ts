import { PackageJson } from "read-pkg";
import { PkgJsonPossibleTypes } from "./json-types";
import { BrowserBuildFormat } from "./types";

export type PkgJsonRelevantOutputFields = "main" | "module" | "browser" | "types" | "typings";
export type PkgJsonModuleOutputFields = Extract<PkgJsonRelevantOutputFields, "main" | "module" | "browser">;
export type PkgJsonTypesOutputFields = Extract<PkgJsonRelevantOutputFields, "types">;

export interface BundlibPkgInputOptions {
  input: PkgJsonPossibleTypes;
}

export interface BundlibPkgFlagOptions222 {
  sourcemap: PkgJsonPossibleTypes;
  esModule: PkgJsonPossibleTypes;
  interop: PkgJsonPossibleTypes;
  extend: PkgJsonPossibleTypes;
  equals: PkgJsonPossibleTypes;
}

export type ValidMinOption = PkgJsonModuleOutputFields | PkgJsonModuleOutputFields[] | boolean | null | undefined;

export interface BundlibPkgOtherOptions {
  browser: PkgJsonPossibleTypes;
  name: PkgJsonPossibleTypes;
  id: PkgJsonPossibleTypes;
  globals: PkgJsonPossibleTypes;
  sourcemap: PkgJsonPossibleTypes;
  min: PkgJsonPossibleTypes;
}

export interface BundlibPkgDeprecatedOptions {
  iife: PkgJsonPossibleTypes;
  amd: PkgJsonPossibleTypes;
  umd: PkgJsonPossibleTypes;
}

export type BundlibPkgOptions = Partial<
  BundlibPkgInputOptions &
  BundlibPkgFlagOptions222 &
  BundlibPkgOtherOptions &
  BundlibPkgDeprecatedOptions
>;

export interface BundlibPkgJson extends PackageJson {
  bundlib?: PkgJsonPossibleTypes;
}

export type BundlibPkgFlagFields = keyof BundlibPkgFlagOptions222;

export type PkgJsonOutputFields = PkgJsonModuleOutputFields | PkgJsonTypesOutputFields;

export type BundlibOutputFiles = Record<PkgJsonOutputFields, string | null>;

export interface BundlibDependencies {
  builtin: readonly string[];
  runtime: readonly string[];
  peer: readonly string[];
  bundled: readonly string[];
}

export type MinifyOutOptions = Partial<Record<PkgJsonModuleOutputFields, true>>;

export interface BrowserOptions {
  format: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
}

export interface AnalizedPkg {
  cwd: string;
  pkg: BundlibPkgJson;
  dependencies: BundlibDependencies;
  input: string;
  output: BundlibOutputFiles;
  minify: MinifyOutOptions;
  browser: BrowserOptions;
  options: Record<BundlibPkgFlagFields, boolean>;
}
