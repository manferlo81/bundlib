import { invalidOption } from '../errors/errors';
import { createOneOfLiteral } from '../type-check/advanced';
import type { TypeCheckFunction } from '../types/helper-types';
import { resolveObject } from './resolve-object';
import { resolveStrings } from './resolve-strings';
import { resolveValid } from './resolve-valid';
import type { SelectiveResolved } from './types';

export function resolveBoolBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, boolean | V | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);
  const invalid = invalidOption(optionName, urlHash);

  return (
    resolveValid<K, V, D>(
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
    resolveObject<K, V, D>(
      value,
      allKeys,
      isBuildType,
      isValidValue,
      defaultValue,
      invalid,
    )
  );

}
