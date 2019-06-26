import { PackageJson } from "read-pkg";
import { BundlibOptions } from "./bundlib-options";

export interface BundlibPkgJson extends PackageJson {
  bundlib?: BundlibOptions;
}
