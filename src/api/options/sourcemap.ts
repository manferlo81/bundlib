import { BuildType, SelectiveSourcemap, WithSourcemapOption } from '../bundlib-options';
import { Nullable } from '../helper-types';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isBool, isNull } from '../type-check/basic';
import { RollupSourcemap, RollupSourcemapString } from '../types';
import { isSelectiveBuildType, MODULE_BUILD_KEYS, SelectiveResolved } from './object-based';
import { resolveSelectiveOption } from './selective';

export const isSourcemapString = createOneOfLiteral<RollupSourcemapString>(
  'inline',
  'hidden',
);

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  isBool,
  isSourcemapString,
);

export const resolveSourcemapOption = (value: SelectiveSourcemap): SelectiveResolved<BuildType, RollupSourcemap> => (
  resolveSelectiveOption<BuildType, RollupSourcemap>(
    value,
    true,
    isSelectiveBuildType,
    isSourcemapOption,
    MODULE_BUILD_KEYS,
    'sourcemap',
    'https://github.com/manferlo81/bundlib#sourcemap',
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

  if (isNull(sourcemap)) {
    return def;
  }

  return isSourcemapString(sourcemap) ? sourcemap : (sourcemap !== false);

}
