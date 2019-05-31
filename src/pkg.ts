import { PackageJson } from "read-pkg";
import { PkgJsonPossibleTypes } from "./json-types";
import { BrowserBuildFormat, Some } from "./types";

export type PkgJsonOutputFields = "main" | "module" | "browser" | "types" | "typings";
export type PkgJsonModuleOutputFields = Some<PkgJsonOutputFields, "main" | "module" | "browser">;

export interface BundlibPkgInputOptions {
  input: PkgJsonPossibleTypes;
}

export interface BundlibPkgFlagOptions {
  esModule: PkgJsonPossibleTypes;
  interop: PkgJsonPossibleTypes;
  extend: PkgJsonPossibleTypes;
  equals: PkgJsonPossibleTypes;
}

export interface BundlibPkgBrowserOptions {
  browser: PkgJsonPossibleTypes;
  name: PkgJsonPossibleTypes;
  id: PkgJsonPossibleTypes;
  globals: PkgJsonPossibleTypes;
}

export interface BundlibPkgTransformableOptions {
  sourcemap: PkgJsonPossibleTypes;
  min: PkgJsonPossibleTypes;
}

export interface BundlibPkgDeprecatedOptions {
  iife: PkgJsonPossibleTypes;
  amd: PkgJsonPossibleTypes;
  umd: PkgJsonPossibleTypes;
}

interface BundlibPkgSourceMapOptions {
  sourcemap: boolean;
}

export type BundlibPkgThrouOptions = Partial<BundlibPkgFlagOptions>;

export type BundlibPkgOptions = BundlibPkgThrouOptions & Partial<
  BundlibPkgInputOptions &
  BundlibPkgBrowserOptions &
  BundlibPkgTransformableOptions &
  BundlibPkgDeprecatedOptions
>;

export interface BundlibPkgJson extends PackageJson {
  bundlib?: PkgJsonPossibleTypes;
}

export interface BundlibOutputFiles {
  main: string | null;
  module: string | null;
  browser: string | null;
  types: string | null;
}

export interface BundlibDependencies {
  builtin: readonly string[];
  runtime: readonly string[];
  peer: readonly string[];
  bundled: readonly string[];
}

export type MinifyOutOptions = Partial<Record<PkgJsonModuleOutputFields, boolean>>;

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
  options: BundlibPkgSourceMapOptions & BundlibPkgThrouOptions;
}
