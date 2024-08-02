import type { AllowNullish } from './helper-types';
import type { RollupSourcemap } from './rollup';

/** @deprecated */
export interface DeprecatedESModuleBuildOptions {
  /** @deprecated use top level "sourcemap" option */
  sourcemap?: AllowNullish<RollupSourcemap>;
  /** @deprecated use top level "min" option */
  min?: AllowNullish<boolean>;
}

/** @deprecated */
export type DeprecatedModuleOption = AllowNullish<DeprecatedESModuleBuildOptions | false>;

/** @deprecated */
export interface DeprecatedBundlibOptions {
  /** @deprecated */
  module?: DeprecatedModuleOption;
}
