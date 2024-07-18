import type { BundlibConfig } from './bundlib-options';
import type { Dictionary } from './helper-types';

export type PkgJsonModuleType = 'commonjs' | 'module';

type PkgJsonExportsValue = string | PkgJsonExportsObject;
export type PkgJsonExportsPaths = Dictionary<PkgJsonExportsValue>;

interface PkgJsonExportsObject {
  readonly node?: PkgJsonExportsValue;
  readonly import?: PkgJsonExportsValue;
  readonly require?: PkgJsonExportsValue;
  readonly types?: PkgJsonExportsValue;
  readonly default?: PkgJsonExportsValue;
}

type PkgJsonExports = PkgJsonExportsPaths | PkgJsonExportsObject;

type PkgJsonDependencies = Readonly<Dictionary<string>>;

export interface BundlibPkgJson {
  readonly name?: string;
  readonly displayName?: string;
  readonly version?: string;
  readonly type?: PkgJsonModuleType;
  readonly exports?: PkgJsonExports;
  readonly main?: string;
  readonly module?: string;
  readonly 'jsnext:main'?: string;
  readonly browser?: string;
  readonly bin?: string;
  readonly types?: string;
  readonly typings?: string;
  readonly dependencies?: PkgJsonDependencies;
  readonly devDependencies?: PkgJsonDependencies;
  readonly peerDependencies?: PkgJsonDependencies;
  readonly bundlib?: BundlibConfig | string;
}
