import { BuildType, SelectiveSourcemap, WithSourcemapOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { composeOneOf } from '../type-check/advanced';
import { isBool, isNull } from '../type-check/basic';
import { RollupSourcemap } from '../types';
import { isSelectiveBuildType, MODULE_BUILD_KEYS, SelectiveResolved } from './object-based';
import { resolveSelectiveOption } from './selective';

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  'inline',
  'hidden',
  isBool,
);

export const resolveSourcemapOption = (value: SelectiveSourcemap): SelectiveResolved<BuildType, RollupSourcemap> => (
  resolveSelectiveOption<BuildType, RollupSourcemap>(
    value,
    true,
    isSelectiveBuildType,
    isSourcemapOption,
    MODULE_BUILD_KEYS,
    'sourcemap',
  )
);

export function normalizeBuildSourcemap(
  build: Nullable<WithSourcemapOption>,
  def: RollupSourcemap,
): RollupSourcemap {

  if (!build) {
    return def;
  }

  const { sourcemap } = build;

  if (isNull(sourcemap) || !isSourcemapOption(sourcemap)) {
    return def;
  }

  return sourcemap;

}
