import type { SelectiveResolved } from 'selective-option';
import { resolveValueBased } from 'selective-option';
import { invalidOption } from '../errors/errors';
import { createOneOfLiteral } from '../type-check/advanced';
import type { Dictionary, TypeCheckFunction } from '../types/helper-types';
import { API_SPECIAL_KEYS } from './consts';

export function resolveObjectBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, V | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);
  const invalid = invalidOption(optionName, urlHash);

  try {
    return resolveValueBased(
      value,
      allKeys,
      isBuildType,
      API_SPECIAL_KEYS as unknown as Dictionary<K[]>,
      isValidValue,
      defaultValue,
    );
  } catch (e) {
    throw invalid;
  }

  // return (
  //   resolveValid<K, V, D>(
  //     value,
  //     allKeys,
  //     isValidValue,
  //     defaultValue,
  //   ) ||
  //   resolveObject<K, V, D>(
  //     value,
  //     allKeys,
  //     isBuildType,
  //     isValidValue,
  //     defaultValue,
  //     invalid,
  //   )
  // );

}
