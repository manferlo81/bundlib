import { MinifiableFields } from "./pkg-analized";
import { BrowserBuildFormat, Nullable, RollupSourcemap } from "./types";

export type GlobalsOptions = Nullable<Record<string, string> | string[]>;
export type MinOption = Nullable<MinifiableFields | MinifiableFields[] | boolean>;

// version 0.10 types

export interface SourceMapOptions {
  sourcemap?: Nullable<RollupSourcemap>;
}

export interface ModuleOptions {
  esModule?: Nullable<boolean>;
  interop?: Nullable<boolean>;
}

export interface SingleMinOptions {
  min?: Nullable<boolean>;
}

export interface InputOptions10 {
  api?: Nullable<string>;
  bin?: Nullable<string>;
}

export interface TopLevelOnlyOptions10 {
  input?: Nullable<InputOptions10 | string>;
  cache?: Nullable<string>;
  min?: MinOption;
}

export interface TopLevelNonESModuleOptions10 extends
  SourceMapOptions, ModuleOptions {
}

export interface TopLevelCommonJSOptions10 {
  equals?: Nullable<boolean>;
}

export interface TopLevelCommonJSOptions10000 {
  extend?: Nullable<boolean>;
}

export interface TopLevelBrowserOptions10 extends TopLevelCommonJSOptions10000 {
  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  globals?: GlobalsOptions;
}

export interface ESModuleBuildOptions10 extends
  SourceMapOptions, SingleMinOptions {
}

export interface BinaryBuildOptions10 extends
  TopLevelNonESModuleOptions10, SingleMinOptions {
}

export interface CommonJSBuildOptions10 extends
  BinaryBuildOptions10, TopLevelCommonJSOptions10 {
}

export interface BrowserBuildOptions10 extends
  TopLevelNonESModuleOptions10, SingleMinOptions, TopLevelBrowserOptions10 {
}

export interface BundlibOptions10 extends
  TopLevelOnlyOptions10, TopLevelNonESModuleOptions10, TopLevelCommonJSOptions10, TopLevelBrowserOptions10 {

  main?: Nullable<CommonJSBuildOptions10 | false>;
  module?: Nullable<ESModuleBuildOptions10 | false>;
  browser?: Nullable<BrowserBuildOptions10 | false>;
  bin?: Nullable<BinaryBuildOptions10 | string | false>;
}
