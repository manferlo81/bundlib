import type { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from 'selective-option';
import type { AllowNullish, Dictionary } from './helper-types';
import type { BrowserBuildFormat, RollupEsModuleString, RollupInterop, RollupSourcemapString } from './rollup';

export type BuildTypeForAPI = 'main' | 'module' | 'browser';
export type BuildType = BuildTypeForAPI | 'bin';

export type GlobalsOption = AllowNullish<Dictionary<string> | string[]>;

export type SelectiveSpecialKey = 'api';
export type SelectiveKey<K extends string> = K | SelectiveSpecialKey;
export type OverrideKey = 'default';
export type SelectiveObjectKey<K extends string> = SelectiveKey<K> | OverrideKey;

export type SelectiveValueBasedOption<K extends string, V> = ValueBasedSelectiveOption<SelectiveObjectKey<K>, V>;
export type SelectiveBoolBasedOption<K extends string, V> = BoolBasedSelectiveOption<SelectiveKey<K>, V, OverrideKey>;

export type SelectiveSkipBuildType = BuildType | 'types';

export type SelectiveStringOption = SelectiveValueBasedOption<BuildType, string>;
export type SelectiveSourcemapOption = SelectiveBoolBasedOption<BuildType, RollupSourcemapString>;
export type SelectiveEsModuleOption = SelectiveBoolBasedOption<BuildType, RollupEsModuleString>;
export type SelectiveInteropOption = SelectiveBoolBasedOption<BuildType, RollupInterop>;
export type SelectiveMinOption = SelectiveBoolBasedOption<BuildType, never>;
export type SelectiveSkipOption = SelectiveBoolBasedOption<SelectiveSkipBuildType, never>;

export type StringOption = AllowNullish<string>;
export type BooleanOption = AllowNullish<boolean>;

export interface BundlibConfig {

  readonly input?: SelectiveStringOption;

  readonly sourcemap?: SelectiveSourcemapOption;
  readonly esModule?: SelectiveEsModuleOption;
  readonly interop?: SelectiveInteropOption;
  readonly min?: SelectiveMinOption;
  readonly skip?: SelectiveSkipOption;
  readonly project?: SelectiveStringOption;

  readonly cache?: StringOption;
  readonly chunks?: AllowNullish<Dictionary<string>>;

  readonly format?: AllowNullish<BrowserBuildFormat>;
  readonly name?: StringOption;
  readonly id?: StringOption;
  readonly extend?: BooleanOption;
  readonly globals?: GlobalsOption;

  readonly equals?: BooleanOption;

}
