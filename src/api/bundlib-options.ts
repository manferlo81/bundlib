import { MinifiableFields } from "./pkg-analized";
import { BrowserBuildFormat, Nullable, RollupSourcemap } from "./types";

export type GlobalsOptions = Nullable<Record<string, string> | string[]>;
export type MinOption = Nullable<MinifiableFields | MinifiableFields[] | boolean>;

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

export interface InputOptions {
  api?: Nullable<string>;
  bin?: Nullable<string>;
}

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
  SourceMapOptions, ModuleOptions, SingleMinOptions {
}

export interface ESModuleBuildOptions extends
  SourceMapOptions, SingleMinOptions {
}

export interface BrowserBuildOptions extends
  SourceMapOptions, ModuleOptions, SingleMinOptions, BrowserOptions {
}

export interface BundlibOptions10 extends
  SourceMapOptions, ModuleOptions, TypesOptions, BrowserOptions {

  input?: Nullable<InputOptions | string>;
  min?: MinOption;
  cache?: Nullable<string>;

  main?: Nullable<CommonJSBuildOptions | false>;
  module?: Nullable<ESModuleBuildOptions | false>;
  browser?: Nullable<BrowserBuildOptions | false>;
  bin?: Nullable<CommonJSBuildOptions | string | false>;
  types?: Nullable<TypesOptions>;

}
