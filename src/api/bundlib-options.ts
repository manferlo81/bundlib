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

export interface CommonJSBuildOptions {
  sourcemap?: Nullable<RollupSourcemap>;
  esModule?: Nullable<boolean>;
  interop?: Nullable<boolean>;
  min?: Nullable<boolean>;
}

export interface ESModuleBuildOptions {
  sourcemap?: Nullable<RollupSourcemap>;
  min?: Nullable<boolean>;
}

export interface BrowserBuildOptions {
  sourcemap?: Nullable<RollupSourcemap>;
  esModule?: Nullable<boolean>;
  interop?: Nullable<boolean>;
  min?: Nullable<boolean>;
  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  extend?: Nullable<boolean>;
  globals?: GlobalsOptions;
}

export type ObjectSelectiveOptions<K extends string, T> = Partial<Record<K | 'default', Nullable<T>>>;

export type StringBasedSelectiveOption<K extends string> =
  | K
  | K[];

export type ObjectBasedSelectiveOption<K extends string, T> =
  | T
  | ObjectSelectiveOptions<K, T>;

export type SelectiveOption<K extends string, T> =
  | StringBasedSelectiveOption<K>
  | ObjectBasedSelectiveOption<K, T>;

export type SelectiveType<K extends string> = K | 'api';

type SelectiveTypeString = SelectiveType<BuildType>;
export type SelectiveSkipBuildType = BuildType | 'types';

export type SelectiveBooleanOption = SelectiveOption<SelectiveTypeString, boolean>;
export type SelectiveStringOption = ObjectBasedSelectiveOption<SelectiveTypeString, string>;
export type SelectiveSourcemap = SelectiveOption<SelectiveTypeString, RollupSourcemap>;
export type SelectiveSkipOption = SelectiveOption<SelectiveType<SelectiveSkipBuildType>, boolean>;

export interface BundlibOptions {

  input?: Nullable<SelectiveStringOption>;

  sourcemap?: Nullable<RollupSourcemap>;
  esModule?: Nullable<SelectiveBooleanOption>;
  interop?: Nullable<SelectiveBooleanOption>;
  min?: Nullable<SelectiveBooleanOption>;
  skip?: Nullable<SelectiveSkipOption>;
  cache?: Nullable<string>;
  project?: Nullable<SelectiveStringOption>;

  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  extend?: Nullable<boolean>;
  globals?: GlobalsOptions;

  equals?: Nullable<boolean>;

  main?: Nullable<CommonJSBuildOptions | false>;
  module?: Nullable<ESModuleBuildOptions | false>;
  browser?: Nullable<BrowserBuildOptions | false>;
  bin?: Nullable<CommonJSBuildOptions | string | false>;
  types?: Nullable<TypesOptions>;

}
