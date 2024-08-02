import type { GlobalsOptions } from './bundlib-options';
import type { AllowNullish } from './helper-types';
import type { BrowserBuildFormat, RollupSourcemap } from './rollup';

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

export type DeprecatedModuleOption = AllowNullish<DeprecatedESModuleBuildOptions | false>;
export type DeprecatedBrowserOption = AllowNullish<DeprecatedBrowserBuildOptions | false>;

/** @deprecated */
export interface DeprecatedBundlibOptions {
  /** @deprecated */
  module?: DeprecatedModuleOption;
  /** @deprecated */
  browser?: DeprecatedBrowserOption;
}
