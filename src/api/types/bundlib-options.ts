import { DeprecatedBundlibOptions } from './deprecated-options';
import type { Dictionary, Nullable } from './helper-types';
import type { BrowserBuildFormat, RollupSourcemap } from './types';

export type BuildTypeForAPI = 'main' | 'module' | 'browser';
export type BuildType = BuildTypeForAPI | 'bin';

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

export interface BrowserOptions {
  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  extend?: Nullable<boolean>;
  globals?: GlobalsOptions;
}

export type SelectiveType<K extends string> = BuildTypeForAPI | K | 'api';
export type ObjectSelectiveOptionsKey<K extends string> = SelectiveType<K> | 'default';

export type ObjectSelectiveOptions<K extends string, T> = Partial<Record<ObjectSelectiveOptionsKey<K>, Nullable<T>>>;

export type StringBasedSelectiveOption<K extends string> =
  | SelectiveType<K>
  | Array<SelectiveType<K>>;

export type ObjectBasedSelectiveOption<K extends string, T> =
  | Nullable<T>
  | ObjectSelectiveOptions<K, T>;

export type SelectiveOption<K extends string, T> =
  | StringBasedSelectiveOption<K>
  | ObjectBasedSelectiveOption<K, T>;

export type SelectiveSkipBuildType = BuildType | 'types';

export type SelectiveBooleanOption = SelectiveOption<BuildType, boolean>;
export type SelectiveStringOption = ObjectBasedSelectiveOption<BuildType, string>;
export type SelectiveSourcemap = SelectiveOption<BuildType, RollupSourcemap>;
export type SelectiveSkipOption = SelectiveOption<SelectiveSkipBuildType, boolean>;

export interface BundlibOptions extends DeprecatedBundlibOptions, Record<string, unknown> {

  input?: Nullable<SelectiveStringOption>;

  sourcemap?: SelectiveSourcemap;
  esModule?: SelectiveBooleanOption;
  interop?: SelectiveBooleanOption;
  min?: SelectiveBooleanOption;
  cache?: Nullable<string>;
  project?: SelectiveStringOption;
  skip?: SelectiveSkipOption;

  chunks?: Nullable<Dictionary<string>>;

  format?: Nullable<BrowserBuildFormat>;
  name?: Nullable<string>;
  id?: Nullable<string>;
  extend?: Nullable<boolean>;
  globals?: GlobalsOptions;

  equals?: Nullable<boolean>;

}
