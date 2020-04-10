import { BuildType, SelectiveSourcemap, WithSourcemapOption } from '../bundlib-options';
import { error } from '../errors';
import { Nullable } from '../helper-types';
import { keys, keysToObject } from '../helpers';
import { createOneOf } from '../type-check/one-of';
import { isArray, isBool, isNull, isObject } from '../type-check/type-check';
import { RollupSourcemap, RollupSourcemapString } from '../types';
import { keysCheck } from '../validate/validate-keys';
import { isBuildTypeString, isSelectiveObjectKey } from './selective';

export const isSourcemapString = createOneOf<RollupSourcemapString>(
  'inline',
  'hidden',
);

export const isSourcemapOption = createOneOf<Nullable<RollupSourcemap>>(
  isBool,
  isSourcemapString,
);

interface SourcemapBuildOptions {
  main: RollupSourcemap;
  module: RollupSourcemap;
  browser: RollupSourcemap;
  bin: RollupSourcemap;
}

function resolveSourcemapValue(value: Nullable<RollupSourcemap>): RollupSourcemap {
  return isSourcemapString(value) ? value : (value !== false);
}

export function resolveSelectiveSourcemapOption(value: Nullable<SelectiveSourcemap>): SourcemapBuildOptions {

  const apiKeys: ['main', 'module', 'browser'] = ['main', 'module', 'browser'];
  const allKeys = [...apiKeys, 'bin'] as ['main', 'module', 'browser', 'bin'];

  if (isNull(value) || value === true) {
    return keysToObject(
      allKeys,
      true,
    );
  }

  if (value === false || isSourcemapString(value)) {
    return keysToObject(
      allKeys,
      value as (false | RollupSourcemapString),
    );
  }

  if (isBuildTypeString(value)) {
    const base = keysToObject(
      allKeys,
      false,
    );
    if (value === 'api') {
      return keysToObject(
        apiKeys,
        true,
        base,
      );
    }
    base[value] = true;
    return base;
  }

  const invalid = () => error('Invalid "sourcemap" option. Please check the documentation at https://github.com/manferlo81/bundlib#sourcemap');

  if (!isObject(value)) {
    throw invalid();
  }

  if (isArray(value)) {

    const base = keysToObject(
      allKeys,
      false,
    );

    const keys = value.reduce<BuildType[]>((result, type) => {
      if (!isBuildTypeString(type)) {
        throw new Error();
      }
      if (type === 'api') {
        result.push(...apiKeys);
      } else {
        result.push(type);
      }
      return result;
    }, []);

    return keysToObject(keys, true, base);

  }

  if (!keysCheck(value, isSelectiveObjectKey)) {
    throw invalid();
  }

  const { default: override, api, ...others } = value;

  if (!isNull(override) && !isSourcemapOption(override)) {
    throw invalid();
  }

  const result: SourcemapBuildOptions = keysToObject(
    allKeys,
    resolveSourcemapValue(override),
  );

  if (!isNull(api)) {
    if (!isSourcemapOption(api)) {
      throw invalid();
    }
    keysToObject(
      apiKeys,
      resolveSourcemapValue(api),
      result,
    );
  }

  keys(others).forEach((type) => {
    const sourcemap = others[type];
    if (!isNull(sourcemap)) {
      if (!isSourcemapOption(sourcemap)) {
        throw invalid();
      }
      result[type] = resolveSourcemapValue(sourcemap);
    }
  });

  return result;

}

export function normalizeBuildSourcemap2(
  build: Nullable<WithSourcemapOption>,
  def: RollupSourcemap,
): RollupSourcemap {
  return !build || isNull(build.sourcemap)
    ? def
    : resolveSourcemapValue(build.sourcemap);
}
