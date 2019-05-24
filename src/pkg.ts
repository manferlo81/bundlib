import { PackageJson } from "read-pkg";

export interface BundlibInputOptions {
  input: string;
}

export interface BundlibBuildOptions {

  sourcemap: boolean;
  esModule: boolean;
  interop: boolean;
  extend: boolean;
  equals: boolean;

  browser: "umd" | "amd" | "iife";
  name: string | null;
  id: string | null;
  globals?: Record<string, string>;

}

interface BundlibDeprecatedOptions {
  iife: string;
  amd: string;
  umd: string;
}

export type BundlibPkgOptions = Partial<BundlibInputOptions & BundlibBuildOptions & BundlibDeprecatedOptions>;

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

  /**
   * bundlib options, extracted from package.josn then normalized
   */
  options: BundlibBuildOptions;

}
