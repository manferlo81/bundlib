import { PackageJson } from "read-pkg";

import { BrowserBuildFormat } from "./types";

export interface BundlibPkgInputOptions {
  input: string;
}

export type PkgJsonFields = "main" | "module" | "browser";

export interface BundlibBuildOptions {

  sourcemap: boolean;
  esModule: boolean;
  interop: boolean;
  extend: boolean;
  equals: boolean;

  browser: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals?: Record<string, string>;

}

interface BundlibTransformableOptions {
  min: PkgJsonFields[];
}

interface BundlibDeprecatedOptions {
  iife: string;
  amd: string;
  umd: string;
}

export type BundlibPkgOptions = Partial<
  BundlibPkgInputOptions &
  BundlibBuildOptions &
  BundlibDeprecatedOptions &
  BundlibTransformableOptions
>;

export interface BundlibPkgJson extends PackageJson {
  bundlib?: BundlibPkgOptions;
}

export interface BundlibOutputFiles {
  cjs: string | null;
  es: string | null;
  browser: string | null;
  types: string | null;
}

export interface BundlibDependencies {
  builtin: readonly string[];
  runtime: readonly string[];
  peer: readonly string[];
  bundled: readonly string[];
}

export interface AnalizedPkg {

  /**
   * the current working directory
   */
  cwd: string;

  /**
   * the original package.json
   */
  pkg: BundlibPkgJson;

  /**
   * dependencies
   */
  dependencies: BundlibDependencies;

  /**
   *
   */
  input: string;

  /**
   */
  output: BundlibOutputFiles;

  minify: Record<PkgJsonFields, boolean>;

  /**
   * bundlib options, extracted from package.josn then normalized
   */
  options: BundlibBuildOptions;

}
