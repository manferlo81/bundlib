import { SourceMapOptions } from "./bundlib-options";
import { isNull } from "./type-check";
import { Nullable, RollupSourcemap } from "./types";

export function normalizeSourcemap(sourcemap: any): RollupSourcemap {
  return sourcemap === "inline" ? "inline" : (sourcemap !== false);
}

export function normalizeBuildSourcemap(
  build: Nullable<SourceMapOptions>,
  def: RollupSourcemap,
): RollupSourcemap {
  return !build || isNull(build.sourcemap)
    ? def
    : normalizeSourcemap(build.sourcemap);
}
