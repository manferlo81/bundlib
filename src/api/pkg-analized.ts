import { BundlibPkgJson } from './pkg'
import { BrowserBuildFormat, RollupSourcemap } from './types'

export interface InputOptions {
  api: string | null;
  bin: string | null;
}

export interface PathOptions {
  path: string;
}

export interface ESModuleBuildOptions extends PathOptions {
  sourcemap: RollupSourcemap;
  min: boolean;
}

export interface CommonJSBuildOptions extends ESModuleBuildOptions {
  esModule: boolean;
  interop: boolean;
}

export interface BrowserBuildOptions extends CommonJSBuildOptions {
  format: BrowserBuildFormat;
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
  extend: boolean;
}

export interface TypesBuildOptions extends PathOptions {
  equals: boolean;
}

export interface OutputOptions {
  main: CommonJSBuildOptions | null;
  module: ESModuleBuildOptions | null;
  browser: BrowserBuildOptions | null;
  bin: CommonJSBuildOptions | null;
  types: TypesBuildOptions | null;
}

export type Dependencies = Record<'runtime' | 'dev' | 'peer', Record<string, string> | null>;

export interface PkgAnalized {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputOptions;
  output: OutputOptions;
  dependencies: Dependencies;
  cache: string | null;
}
