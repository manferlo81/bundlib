import { ModuleOptions, TopLevelCommonJSOptions10, TopLevelCommonJSOptions10000 } from "./bundlib-options";
import { isNull } from "./type-check";
import { Nullable } from "./types";

type BuildObjectWithFlags = TopLevelCommonJSOptions10 & ModuleOptions & TopLevelCommonJSOptions10000;

export function normalizeBuildFlag(
  build: Nullable<BuildObjectWithFlags>,
  key: keyof BuildObjectWithFlags,
  def: boolean,
): boolean {
  return !build || isNull(build[key]) ? def : !!build[key];
}
