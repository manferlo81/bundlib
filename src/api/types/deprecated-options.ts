import type { Nullable } from './helper-types';
import { GlobalsOptions } from './bundlib-options';
import { BrowserBuildFormat, RollupSourcemap } from './types';

/** @deprecated */
export interface DeprecatedCommonJSBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: Nullable<RollupSourcemap>;
  /** @deprecated use top level "esModule" option */
  esModule?: Nullable<boolean>;
  /** @deprecated use top level "interop" option */
  interop?: Nullable<boolean>;
  /** @deprecated use top level "min" option */
  min?: Nullable<boolean>;
}

/** @deprecated */
export interface DeprecatedESModuleBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: Nullable<RollupSourcemap>;
  /** @deprecated use top level "min" option */
  min?: Nullable<boolean>;
}

/** @deprecated */
export interface DeprecatedBrowserBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: Nullable<RollupSourcemap>;
  /** @deprecated use top level "esModule" option */
  esModule?: Nullable<boolean>;
  /** @deprecated use top level "interop" option */
  interop?: Nullable<boolean>;
  /** @deprecated use top level "min" option */
  min?: Nullable<boolean>;
  /** @deprecated use top level "format" option */
  format?: Nullable<BrowserBuildFormat>;
  /** @deprecated use top level "name" option */
  name?: Nullable<string>;
  /** @deprecated use top level "id" option */
  id?: Nullable<string>;
  /** @deprecated use top level "extend" option */
  extend?: Nullable<boolean>;
  /** @deprecated use top level "globals" option */
  globals?: GlobalsOptions;
}

/** @deprecated */
export interface DeprecatedTypesOptions {
  /** @deprecated use top level "equals" option */
  equals?: Nullable<boolean>;
}

/** @deprecated */
export interface DeprecatedBundlibOptions {
  /** @deprecated */
  main?: Nullable<DeprecatedCommonJSBuildOptions | false>;
  /** @deprecated */
  module?: Nullable<DeprecatedESModuleBuildOptions | false>;
  /** @deprecated */
  browser?: Nullable<DeprecatedBrowserBuildOptions | false>;
  /** @deprecated */
  bin?: Nullable<DeprecatedCommonJSBuildOptions | string | false>;
  /** @deprecated */
  types?: Nullable<DeprecatedTypesOptions | false>;
}
