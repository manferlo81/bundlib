import { StrictNullable, Dictionary } from './helper-types'
import { BundlibPkgJson } from './pkg'
import { BrowserBuildFormat, RollupSourcemap } from './types'

export interface InputOptions {
  api: StrictNullable<string>;
  bin: StrictNullable<string>;
}

export interface OptionsWithPath {
  path: string;
}

export interface ESModuleBuildOptions extends OptionsWithPath {
  sourcemap: RollupSourcemap;
  min: boolean;
}

export interface CommonJSBuildOptions extends ESModuleBuildOptions {
  esModule: boolean;
  interop: boolean;
}

export interface BrowserBuildOptions extends CommonJSBuildOptions {
  format: BrowserBuildFormat;
  name: StrictNullable<string>;
  id: StrictNullable<string>;
  globals: StrictNullable<Dictionary<string>>;
  extend: boolean;
}

export interface TypesBuildOptions extends OptionsWithPath {
  equals: boolean;
}

export interface OutputOptions {
  main: StrictNullable<CommonJSBuildOptions>;
  module: StrictNullable<ESModuleBuildOptions>;
  browser: StrictNullable<BrowserBuildOptions>;
  bin: StrictNullable<CommonJSBuildOptions>;
  types: StrictNullable<TypesBuildOptions>;
}

export interface Dependencies {
  runtime: StrictNullable<Dictionary<string>>;
  dev: StrictNullable<Dictionary<string>>;
  peer: StrictNullable<Dictionary<string>>;
}

export interface PkgAnalized {
  cwd: string;
  pkg: BundlibPkgJson;
  input: InputOptions;
  output: OutputOptions;
  dependencies: Dependencies;
  cache: StrictNullable<string>;
  project: StrictNullable<string>;
}
