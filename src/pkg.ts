import { PackageJson } from "read-pkg";
import { BundlibOptions } from "./bundlib-options";

export type PkgJsonModuleOutputFields = "main" | "module" | "browser";
export type PkgJsonTypesOutputFields = "types";
export type PkgJsonRelevantOutputFields = PkgJsonModuleOutputFields | PkgJsonTypesOutputFields | "typings";

export interface BundlibPkgJson extends PackageJson {
  bundlib?: BundlibOptions;
}

export type PkgJsonOutputFields = PkgJsonModuleOutputFields | PkgJsonTypesOutputFields;
