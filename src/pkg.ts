import { PackageJson } from "read-pkg";
import { BundlibOptions } from "./bundlib-options";

export type PkgJsonModuleOutputFields = "main" | "module" | "browser";

export interface BundlibPkgJson extends PackageJson {
  bundlib?: BundlibOptions;
}

export type PkgJsonOutputFields = PkgJsonModuleOutputFields | "types";
