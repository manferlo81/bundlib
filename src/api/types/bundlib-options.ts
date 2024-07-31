import { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from 'selective-option';
import type { DeprecatedBundlibOptions } from './deprecated-options';
import type { AllowNullish, Dictionary } from './helper-types';
import type { BrowserBuildFormat, RollupSourcemap, RollupSourcemapString } from './types';

export type BuildTypeForAPI = 'main' | 'module' | 'browser';
export type BuildType = BuildTypeForAPI | 'bin';

export type GlobalsOptions = AllowNullish<Dictionary<string> | string[]>;

export interface WithSourcemapOption {
  sourcemap?: AllowNullish<RollupSourcemap>;
}

export interface WithModuleOptions {
  esModule?: AllowNullish<boolean>;
  interop?: AllowNullish<boolean>;
}

export interface WithMinOption {
  min?: AllowNullish<boolean>;
}

export interface InputOptions {
  api?: AllowNullish<string>;
  bin?: AllowNullish<string>;
}

export type ModuleString = Exclude<BuildType, 'module'>;
export type ModuleOption = AllowNullish<ModuleString | ModuleString[] | boolean>;

export type MinOption = AllowNullish<BuildType | BuildType[] | boolean>;

export interface BrowserOptions {
  format?: AllowNullish<BrowserBuildFormat>;
  name?: AllowNullish<string>;
  id?: AllowNullish<string>;
  extend?: AllowNullish<boolean>;
  globals?: GlobalsOptions;
}

/** @deprecated */
export type ObjectSelectiveOptions<K extends string, T> = Partial<Record<ObjectSelectiveOptionsKey<K>, AllowNullish<T>>>;

/** @deprecated */
export type StringBasedSelectiveOption<K extends string> =
  | SelectiveType<K>
  | Array<SelectiveType<K>>;

export type SelectiveType<K extends string> = K | 'api';
export type OverrideKey = 'default';
export type ObjectSelectiveOptionsKey<K extends string> = SelectiveType<K> | OverrideKey;

export type ObjectBasedSelectiveOption<K extends string, T> = ValueBasedSelectiveOption<ObjectSelectiveOptionsKey<K>, T>;
export type SelectiveOption<K extends string, V = never> = BoolBasedSelectiveOption<SelectiveType<K>, V, OverrideKey>;

export type SelectiveSkipBuildType = BuildType | 'types';

export type SelectiveBooleanOption = SelectiveOption<BuildType>;
export type SelectiveStringOption = ObjectBasedSelectiveOption<BuildType, string>;
export type SelectiveSourcemap = SelectiveOption<BuildType, RollupSourcemapString>;
export type SelectiveSkipOption = SelectiveOption<SelectiveSkipBuildType>;

export interface BundlibConfig extends DeprecatedBundlibOptions, Record<string, unknown> {

  input?: SelectiveStringOption;

  sourcemap?: SelectiveSourcemap;
  esModule?: SelectiveBooleanOption;
  interop?: SelectiveBooleanOption;
  min?: SelectiveBooleanOption;
  cache?: AllowNullish<string>;
  project?: SelectiveStringOption;
  skip?: SelectiveSkipOption;

  chunks?: AllowNullish<Dictionary<string>>;

  format?: AllowNullish<BrowserBuildFormat>;
  name?: AllowNullish<string>;
  id?: AllowNullish<string>;
  extend?: AllowNullish<boolean>;
  globals?: GlobalsOptions;

  equals?: AllowNullish<boolean>;

}
