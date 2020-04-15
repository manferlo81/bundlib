import { BuildType, SelectiveSourcemap, WithSourcemapOption } from '../bundlib-options';
import { invalidOption } from '../errors';
import { Nullable } from '../helper-types';
import { keys, keysToObject } from '../tools/helpers';
import { createOneOf } from '../type-check/one-of';
import { isArray, isNull, isObject } from '../type-check/type-check';
import { RollupSourcemap, RollupSourcemapString } from '../types';
import { keysCheck } from '../validate/validate-keys';
import { ALL_KEYS, API_KEYS, isBuildTypeString, isSelectiveObjectKey, resolveTypeString, resolveTypeStringArray } from './selective';

export const isSourcemapString = createOneOf<RollupSourcemapString>(
  'inline',
  'hidden',
);

export const isSourcemapOption = createOneOf<Nullable<RollupSourcemap>>(
  true,
  false,
  isSourcemapString,
);

export type SourcemapBuildOptions = Record<BuildType, RollupSourcemap>;

function resolveSourcemapValue(value: Nullable<RollupSourcemap>): RollupSourcemap {
  return isSourcemapString(value) ? value : (value !== false);
}

export function resolveSelectiveSourcemapOption(value: Nullable<SelectiveSourcemap>): SourcemapBuildOptions {

  if (isNull(value) || value === true) {
    return keysToObject(
      ALL_KEYS,
      true,
    );
  }

  if (value === false || isSourcemapString(value)) {
    return keysToObject(
      ALL_KEYS,
      value as (false | RollupSourcemapString),
    );
  }

  if (isBuildTypeString(value)) {
    return resolveTypeString(value);
  }

  const invalid = invalidOption('sourcemap', 'https://github.com/manferlo81/bundlib#sourcemap');

  if (!isObject(value)) {
    throw invalid;
  }

  if (isArray(value)) {
    return resolveTypeStringArray(value, invalid);
  }

  if (!keysCheck(value, isSelectiveObjectKey)) {
    throw invalid;
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isSourcemapOption(override)) {
    throw invalid;
  }

  const result: SourcemapBuildOptions = keysToObject(
    ALL_KEYS,
    resolveSourcemapValue(override),
  );

  if (!isNull(api)) {
    if (!isSourcemapOption(api)) {
      throw invalid;
    }
    keysToObject(
      API_KEYS,
      resolveSourcemapValue(api),
      result,
    );
  }

  keys(others).forEach((type) => {
    const sourcemap = others[type];
    if (!isNull(sourcemap)) {
      if (!isSourcemapOption(sourcemap)) {
        throw invalid;
      }
      result[type] = resolveSourcemapValue(sourcemap);
    }
  });

  return result;

}

export function normalizeBuildSourcemap(
  build: Nullable<WithSourcemapOption>,
  def: RollupSourcemap,
): RollupSourcemap {
  return !build || isNull(build.sourcemap)
    ? def
    : resolveSourcemapValue(build.sourcemap);
}
