import { PackageJson } from "read-pkg";

export interface BundlibBuildInputOptions {
  input: string;
}

export interface BundlibOutputOptions {

  sourcemap: boolean;
  esModule: boolean;
  interop: boolean;
  extend: boolean;
  equals: boolean;

  name: string | null;
  id: string | null;
  globals?: Record<string, string>;

}

export interface BundlibBuildOptions extends BundlibOutputOptions, BundlibBuildInputOptions {
  iife: string | null;
  amd: string | null;
  umd: string | null;
}

//

export type BundlibPkgOptions = Partial<BundlibBuildOptions>;

//

export interface Pkg extends PackageJson {
  bundlib?: BundlibPkgOptions;
}
