import type { BundlibOptions } from './bundlib-options';
import type { Dictionary } from './helper-types';

export interface BundlibPkgJson {
  name?: string;
  displayName?: string;
  version?: string;
  main?: string;
  module?: string;
  browser?: string;
  bin?: string;
  types?: string;
  typings?: string;
  dependencies?: Dictionary<string>;
  devDependencies?: Dictionary<string>;
  peerDependencies?: Dictionary<string>;
  'jsnext:main'?: string;
  bundlib?: BundlibOptions | string;
}
