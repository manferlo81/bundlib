import type { BundlibOptions } from '../types/bundlib-options';
import type { Dictionary } from '../types/helper-types';

type ModuleType = 'commonjs' | 'module';

type ExportsPaths = Record<string, string | ExportsObject>;

interface ExportsObject {
  import: string | ExportsObject;
  require: string | ExportsObject;
  node: string | ExportsObject;
  default: string | ExportsObject;
}

type Exports = string | ExportsObject | ExportsPaths;

type Dependencies = Dictionary<string>;

export interface BundlibPkgJson {
  name?: string;
  displayName?: string;
  version?: string;
  type?: ModuleType;
  exports?: Exports;
  main?: string;
  module?: string;
  'jsnext:main'?: string;
  browser?: string;
  bin?: string;
  types?: string;
  typings?: string;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  bundlib?: BundlibOptions | string;
}
