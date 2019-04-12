export type Dependencies = Record<string, string>;

export interface BundlibBuildOptions {

  input: string;

  sourcemap: boolean;
  esModule: boolean;
  interop: boolean;

  iife: string | null;
  umd: string | null;
  name: string;
  extend: boolean;
  id: string | null;
  globals?: Record<string, string>;

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
  typings?: string;
  types?: string;
  bundlib?: BundlibPkgOptions;
}
