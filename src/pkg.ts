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

  name: string | null;
  id: string | null;
  globals?: Record<string, string>;

}

export interface BundlibOutputOptions {
  iife: string | null;
  amd: string | null;
  umd: string | null;
}

export type BundlibPkgOptions = Partial<BundlibInputOptions & BundlibOutputOptions & BundlibBuildOptions>;

export interface Pkg extends PackageJson {
  bundlib?: BundlibPkgOptions;
}

export interface BundlibOutputFiles extends BundlibOutputOptions {
  cjs: string | null;
  es: string | null;
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
  pkg: Pkg;

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
