import type { WarningHandlerWithDefault } from 'rollup';

export interface BundlibAPIOptions {
  dev?: boolean;
  watch?: boolean;
  onwarn?: WarningHandlerWithDefault;
}
