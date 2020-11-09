import { invalidOption } from '../errors';
import { createOneOfLiteral } from '../type-check/advanced';
import type { TypeCheckFunction } from '../types/helper-types';
import { resolveObject } from './resolve-object';
import { resolveStrings } from './resolve-strings';
import { resolveValid } from './resolve-valid';
import type { SelectiveResolved } from './types';

export function resolveBoolBasedSelectiveOption<K extends string, T, D = T>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<T>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, boolean | T | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);
  const invalid = invalidOption(optionName, urlHash);

  return (
    resolveValid<K, T | D>(
      value,
      allKeys,
      isValidValue,
      defaultValue,
    ) ||
    resolveStrings<K>(
      value,
      allKeys,
      isBuildType,
      invalid,
    ) ||
    resolveObject<K, T | D>(
      value,
      allKeys,
      isBuildType,
      isValidValue,
      defaultValue,
      invalid,
    )
  );

}
