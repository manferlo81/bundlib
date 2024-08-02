import type { AllowNullish } from './helper-types';
import { GlobalsOptions } from './bundlib-options';
import { BrowserBuildFormat, RollupSourcemap } from './rollup';

/** @deprecated */
export interface DeprecatedCommonJSBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: AllowNullish<RollupSourcemap>;
  /** @deprecated use top level "esModule" option */
  esModule?: AllowNullish<boolean>;
  /** @deprecated use top level "interop" option */
  interop?: AllowNullish<boolean>;
  /** @deprecated use top level "min" option */
  min?: AllowNullish<boolean>;
}

/** @deprecated */
export interface DeprecatedESModuleBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: AllowNullish<RollupSourcemap>;
  /** @deprecated use top level "min" option */
  min?: AllowNullish<boolean>;
}

/** @deprecated */
export interface DeprecatedBrowserBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: AllowNullish<RollupSourcemap>;
  /** @deprecated use top level "esModule" option */
  esModule?: AllowNullish<boolean>;
  /** @deprecated use top level "interop" option */
  interop?: AllowNullish<boolean>;
  /** @deprecated use top level "min" option */
  min?: AllowNullish<boolean>;
  /** @deprecated use top level "format" option */
  format?: AllowNullish<BrowserBuildFormat>;
  /** @deprecated use top level "name" option */
  name?: AllowNullish<string>;
  /** @deprecated use top level "id" option */
  id?: AllowNullish<string>;
  /** @deprecated use top level "extend" option */
  extend?: AllowNullish<boolean>;
  /** @deprecated use top level "globals" option */
  globals?: GlobalsOptions;
}

export type DeprecatedMainOption = AllowNullish<DeprecatedCommonJSBuildOptions | false>;
export type DeprecatedModuleOption = AllowNullish<DeprecatedESModuleBuildOptions | false>;
export type DeprecatedBrowserOption = AllowNullish<DeprecatedBrowserBuildOptions | false>;
export type DeprecatedBinaryOption = AllowNullish<DeprecatedCommonJSBuildOptions | string | false>;

/** @deprecated */
export interface DeprecatedBundlibOptions {
  /** @deprecated */
  main?: DeprecatedMainOption;
  /** @deprecated */
  module?: DeprecatedModuleOption;
  /** @deprecated */
  browser?: DeprecatedBrowserOption;
  /** @deprecated */
  bin?: DeprecatedBinaryOption;
}
