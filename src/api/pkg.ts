import { PackageJson } from "read-pkg";
import { BundlibOptions10 } from "./bundlib-options";

interface JSNextLegacyPkgJson extends PackageJson {
  "jsnext:main"?: string;
}

export interface BundlibPkgJson extends JSNextLegacyPkgJson {
  bundlib?: BundlibOptions10;
}
