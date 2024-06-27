import { resolveValueBased, type SelectiveResolved } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';
import { createOneOfLiteral } from '../type-check/advanced';
import { type Dictionary, type TypeCheckFunction } from '../types/helper-types';

export function resolveValueBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: K[],
  specialKeys: Dictionary<K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): SelectiveResolved<K, V | D> {

  const isBuildType = createOneOfLiteral<K>(allKeys);
  const invalid = error(invalidOptionMessage(optionName, urlHash));

  try {
    return resolveValueBased(
      value,
      allKeys,
      isBuildType,
      specialKeys,
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
