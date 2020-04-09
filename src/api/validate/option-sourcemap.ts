import { WithSourcemapOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { isNull } from '../type-check';
import { RollupSourcemap } from '../types';

export function normalizeSourcemap(sourcemap: unknown): RollupSourcemap {
  return sourcemap === 'inline' || sourcemap === 'hidden' ? sourcemap : (sourcemap !== false);
}

export function normalizeBuildSourcemap(
  build: Nullable<WithSourcemapOption>,
  def: RollupSourcemap,
): RollupSourcemap {
  return !build || isNull(build.sourcemap)
    ? def
    : normalizeSourcemap(build.sourcemap);
}
