import { BuildType, SelectiveSourcemap, WithSourcemapOption } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable } from '../helper-types';
import { keysToObject } from '../tools/helpers';
import { composeOneOf, createOneOfLiteral } from '../type-check/advanced';
import { isArray, isBool, isNull, isObject } from '../type-check/basic';
import { RollupSourcemap, RollupSourcemapString } from '../types';
import { MODULE_BUILD_KEYS, isBuildTypeString, isSelectiveObjectKey, resolveObjectSelectiveOption } from './object-based';
import { resolveTypeString, resolveTypeStringArray } from './string-based';

export const isSourcemapString = createOneOfLiteral<RollupSourcemapString>(
  'inline',
  'hidden',
);

export const isSourcemapOption = composeOneOf<RollupSourcemap>(
  isBool,
  isSourcemapString,
);

export type SourcemapBuildOptions = Record<BuildType, RollupSourcemap>;

export function resolveSourcemapOption(value: SelectiveSourcemap): SourcemapBuildOptions {

  if (isNull(value) || value === true) {
    return keysToObject(
      MODULE_BUILD_KEYS,
      true,
    );
  }

  if (value === false || isSourcemapString(value)) {
    return keysToObject(
      MODULE_BUILD_KEYS,
      value as (false | RollupSourcemapString),
    );
  }

  if (isBuildTypeString(value)) {
    return resolveTypeString(
      value,
      MODULE_BUILD_KEYS,
    );
  }

  const invalid = invalidOption('sourcemap', 'https://github.com/manferlo81/bundlib#sourcemap');

  if (!isObject(value)) {
    throw invalid;
  }

  if (isArray(value)) {
    return resolveTypeStringArray(
      value,
      isBuildTypeString,
      MODULE_BUILD_KEYS,
      invalid,
    );
  }

  return resolveObjectSelectiveOption<BuildType, RollupSourcemap, true>(
    value,
    true,
    MODULE_BUILD_KEYS,
    isSelectiveObjectKey,
    isSourcemapOption,
    invalid,
  );

}

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
