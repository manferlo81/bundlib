import { BundlibOutputOptions, Pkg } from "./npm-pkg";

export interface BundlibPkgOutput {
  cjs: string | null;
  es: string | null;
  iife: string | null;
  amd: string | null;
  umd: string | null;
  types: string | null;
}

export interface BundlibDependencies {
  builtin: string[];
  runtime: string[];
  peer: string[];
  bundled: string[];
}

export interface BundlibPkg {

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
  output: BundlibPkgOutput;

  /**
   * bundlib options, extracted from package.josn then normalized
   */
  options: BundlibOutputOptions;

}
