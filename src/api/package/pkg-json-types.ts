import type { BundlibConfig } from '../types/bundlib-options';

export type PkgJsonObject<K extends string, T> = Readonly<Partial<Record<K, T>>>;

export type PkgJsonModuleType = 'commonjs' | 'module';

export type PkgJsonExportsPath = `./${string}`;
export type PkgJsonExportsValue = PkgJsonExportsPath | PkgJsonExportsObject;
export type PkgJsonExportsPathsObject = PkgJsonObject<PkgJsonExportsPath, PkgJsonExportsValue>;

export interface PkgJsonExportsObject {
  readonly import?: PkgJsonExportsValue;
  readonly require?: PkgJsonExportsValue;
  readonly node?: PkgJsonExportsValue;
  readonly types?: PkgJsonExportsValue;
  readonly default?: PkgJsonExportsValue;
}

export type PkgJsonExports = PkgJsonExportsPathsObject | PkgJsonExportsValue;

export type PkgJsonDependencies = PkgJsonObject<string, string>;

export interface BundlibPkgJson extends PkgJsonObject<string, unknown> {
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
