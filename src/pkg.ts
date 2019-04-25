export type Dependencies = Record<string, string>;

export interface BundlibBuildInputOptions {
  input: string;
}

export interface BundlibOutputOptions {

  sourcemap: boolean;
  esModule: boolean;
  interop: boolean;
  extend: boolean;
  equals: boolean;

  name: string;
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

export interface Pkg {
  name: string;
  main?: string;
  module?: string;
  bin?: string;
  dependencies?: Dependencies;
  peerDependencies?: Dependencies;
  bundleDependencies?: string[];
  bundledDependencies?: string[];
  typings?: string;
  types?: string;
  bundlib?: BundlibPkgOptions;
}
