import { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from 'selective-option';
import type { DeprecatedBundlibOptions } from './deprecated-options';
import type { AllowNullish, Dictionary } from './helper-types';
import type { BrowserBuildFormat, RollupBundlibInterop, RollupEsModuleString, RollupSourcemap, RollupSourcemapString } from './rollup';

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

/** @deprecated */
export type SelectiveType<K extends string> = K | SelectiveSpecialKey;
/** @deprecated */
export type ObjectSelectiveOptionsKey<K extends string> = SelectiveType<K> | OverrideKey;
/** @deprecated */
export type SelectiveOption<K extends string, V = never> = BoolBasedSelectiveOption<SelectiveKey<K>, V, OverrideKey>;
/** @deprecated */
export type ObjectBasedSelectiveOption<K extends string, V> = ValueBasedSelectiveOption<SelectiveObjectKey<K>, V>;
/** @deprecated */
export type SelectiveBooleanOption = SelectiveBoolBasedOption<BuildType>;
/** @deprecated */
export type SelectiveStringOption = SelectiveValueBasedOption<BuildType, string>;

export type SelectiveSpecialKey = 'api';
export type SelectiveKey<K extends string> = K | SelectiveSpecialKey;
export type OverrideKey = 'default';
export type SelectiveObjectKey<K extends string> = SelectiveKey<K> | OverrideKey;

export type SelectiveValueBasedOption<K extends string, V> = ValueBasedSelectiveOption<SelectiveObjectKey<K>, V>;
export type SelectiveBoolBasedOption<K extends string, V = never> = BoolBasedSelectiveOption<SelectiveKey<K>, V, OverrideKey>;

export type SelectiveSkipBuildType = BuildType | 'types';

export type SelectiveString = SelectiveValueBasedOption<BuildType, string>;
export type SelectiveSourcemap = SelectiveBoolBasedOption<BuildType, RollupSourcemapString>;
export type SelectiveEsModule = SelectiveBoolBasedOption<BuildType, RollupEsModuleString>;
export type SelectiveInterop = SelectiveBoolBasedOption<BuildType, RollupBundlibInterop>;
export type SelectiveMin = SelectiveBoolBasedOption<BuildType>;
export type SelectiveSkipOption = SelectiveBoolBasedOption<SelectiveSkipBuildType>;

export interface BundlibConfig extends DeprecatedBundlibOptions {

  readonly input?: SelectiveString;

  readonly sourcemap?: SelectiveSourcemap;
  readonly esModule?: SelectiveEsModule;
  readonly interop?: SelectiveInterop;
  readonly min?: SelectiveMin;
  readonly skip?: SelectiveSkipOption;
  readonly project?: SelectiveString;

  readonly cache?: AllowNullish<string>;
  readonly chunks?: AllowNullish<Dictionary<string>>;

  readonly format?: AllowNullish<BrowserBuildFormat>;
  readonly name?: AllowNullish<string>;
  readonly id?: AllowNullish<string>;
  readonly extend?: AllowNullish<boolean>;
  readonly globals?: GlobalsOptions;

  readonly equals?: AllowNullish<boolean>;

}
