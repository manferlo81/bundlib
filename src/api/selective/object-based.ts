import { invalidOption } from '../errors';
import { createOneOfLiteral } from '../type-check/advanced';
import type { TypeCheckFunction } from '../types/helper-types';
import { resolveObject } from './resolve-object';
import { resolveValid } from './resolve-valid';
import type { SelectiveResolved } from './types';

export function resolveObjectBasedSelectiveOption<K extends string, V, D>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, V | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);
  const invalid = invalidOption(optionName, urlHash);

  return (
    resolveValid<K, V | D>(
      value,
      allKeys,
      isValidValue,
      defaultValue,
    ) ||
    resolveObject<K, V | D>(
      value,
      allKeys,
      isBuildType,
      isValidValue,
      defaultValue,
      invalid,
    )
  );

}
