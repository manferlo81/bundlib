import { Dictionary, Nullable } from './helper-types';
import { BrowserBuildFormat, RollupSourcemap } from './types';

export type BuildType = 'main' | 'module' | 'browser' | 'bin';

export type GlobalsOptions = Nullable<Dictionary<string> | string[]>;

export interface WithSourcemapOption {
  sourcemap?: Nullable<RollupSourcemap>;
}

export interface WithModuleOptions {
  esModule?: Nullable<boolean>;
  interop?: Nullable<boolean>;
}

export interface WithMinOption {
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
  WithSourcemapOption, WithModuleOptions, WithMinOption {
}

export interface ESModuleBuildOptions extends
  WithSourcemapOption, WithMinOption {
}

export interface BrowserBuildOptions extends
  WithSourcemapOption, WithModuleOptions, WithMinOption, BrowserOptions {
}

export interface BundlibOptions extends
  WithSourcemapOption, TypesOptions, BrowserOptions {

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
