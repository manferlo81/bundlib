import type { BundlibOptions } from '../types/bundlib-options';
import type { Dictionary } from '../types/helper-types';

export type PkgJsonModuleType = 'commonjs' | 'module';

type PkgJsonExportsValue = string | PkgJsonExportsObject;
export type PkgJsonExportsPaths = Dictionary<PkgJsonExportsValue>;

interface PkgJsonExportsObject {
  import: PkgJsonExportsValue;
  require: PkgJsonExportsValue;
  node: PkgJsonExportsValue;
  default: PkgJsonExportsValue;
}

type PkgJsonExports = PkgJsonExportsValue | PkgJsonExportsPaths;

type PkgJsonDependencies = Dictionary<string>;

export interface BundlibPkgJson {
  name?: string;
  displayName?: string;
  version?: string;
  type?: PkgJsonModuleType;
  exports?: PkgJsonExports;
  main?: string;
  module?: string;
  'jsnext:main'?: string;
  browser?: string;
  bin?: string;
  types?: string;
  typings?: string;
  dependencies?: PkgJsonDependencies;
  devDependencies?: PkgJsonDependencies;
  peerDependencies?: PkgJsonDependencies;
  bundlib?: BundlibOptions | string;
}
