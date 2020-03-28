import { Dictionary, Nullable } from './helper-types';
import { BrowserBuildFormat, RollupSourcemap } from './types';

export type BuildEnvironment = 'development' | 'production' | 'dev' | 'prod';
export type BuildType = 'main' | 'module' | 'browser' | 'bin';

export type GlobalsOptions = Nullable<Dictionary<string> | string[]>;

export interface SourceMapOptions {
  sourcemap?: Nullable<RollupSourcemap>;
}

export interface PerBuildModuleOptions {
  esModule?: Nullable<boolean>;
  interop?: Nullable<boolean>;
}

export interface PerBuildMinOptions {
  min?: Nullable<boolean>;
}

export interface InputOptions {
  api?: Nullable<string>;
  bin?: Nullable<string>;
}

export type ModuleString = Exclude<BuildType, 'module'>;
export type ModuleOption = Nullable<ModuleString | ModuleString[] | boolean>;

export type MinOption = Nullable<BuildType | BuildType[] | boolean>;

export interface TypesOptions {
  equals?: Nullable<boolean>;
}

export interface BrowserOptions {
  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  extend?: Nullable<boolean>;
  globals?: GlobalsOptions;
}

export interface CommonJSBuildOptions extends
  SourceMapOptions, PerBuildModuleOptions, PerBuildMinOptions {
}

export interface ESModuleBuildOptions extends
  SourceMapOptions, PerBuildMinOptions {
}

export interface BrowserBuildOptions extends
  SourceMapOptions, PerBuildModuleOptions, PerBuildMinOptions, BrowserOptions {
}

export interface BundlibOptions extends
  SourceMapOptions, TypesOptions, BrowserOptions {

  input?: Nullable<InputOptions | string>;
  esModule?: ModuleOption;
  interop?: ModuleOption;
  min?: MinOption;
  cache?: Nullable<string>;
  project?: Nullable<string>;

  main?: Nullable<CommonJSBuildOptions | false>;
  module?: Nullable<ESModuleBuildOptions | false>;
  browser?: Nullable<BrowserBuildOptions | false>;
  bin?: Nullable<CommonJSBuildOptions | string | false>;
  types?: Nullable<TypesOptions>;

}
