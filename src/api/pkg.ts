import { PackageJson } from 'type-fest';
import { BundlibOptions } from './bundlib-options';

interface ImprovedPackageJson extends PackageJson {
  displayName?: string;
  'jsnext:main'?: string;
}

export interface BundlibPkgJson extends ImprovedPackageJson {
  bundlib?: BundlibOptions | string;
}
