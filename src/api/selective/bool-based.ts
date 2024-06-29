import { resolveBoolBased, type SelectiveResolved } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';
import { createOneOfLiteral } from '../type-check/advanced';
import { type Dictionary, type TypeCheckFunction } from '../types/helper-types';

export function resolveBoolBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: K[],
  specialKeys: Dictionary<K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, boolean | V | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);

  try {
    return resolveBoolBased<K, V, D>(
      value,
      allKeys,
      isBuildType,
      specialKeys,
      isValidValue,
      defaultValue,
    );
  } catch (e) {
    throw error(invalidOptionMessage(optionName, urlHash));
  }

}
