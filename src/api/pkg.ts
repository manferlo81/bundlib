import { PackageJson } from 'read-pkg';
import { BundlibOptions } from './bundlib-options';

interface ImprovedPackageJson extends PackageJson {
  displayName?: string;
  'jsnext:main'?: string;
}

export interface BundlibPkgJson extends ImprovedPackageJson {
  bundlib?: BundlibOptions;
}
