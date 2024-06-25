import type { SelectiveResolved } from 'selective-option';
import { resolveBoolBased } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';
import { createOneOfLiteral } from '../type-check/advanced';
import type { Dictionary, TypeCheckFunction } from '../types/helper-types';
import { API_SPECIAL_KEYS } from './consts';

export function resolveBoolBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, boolean | V | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);
  const invalid = error(invalidOptionMessage(optionName, urlHash));

  try {
    return resolveBoolBased<K, V, D>(
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
  //   resolveStrings<K>(
  //     value,
  //     allKeys,
  //     isBuildType,
  //     invalid,
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
