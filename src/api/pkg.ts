import { PackageJson } from 'read-pkg';
import { BundlibOptions } from './bundlib-options';

interface JSNextLegacyPkgJson extends PackageJson {
  'jsnext:main'?: string;
}

export interface BundlibPkgJson extends JSNextLegacyPkgJson {
  bundlib?: BundlibOptions;
}
