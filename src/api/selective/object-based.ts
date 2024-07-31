import type { Resolved } from 'selective-option';
import { createValueBasedResolver } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';
import type { Dictionary, TypeCheckFunction } from '../types/helper-types';
import { OVERRIDE_KEY } from './consts';

export function resolveValueBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: readonly K[],
  specialKeys: Readonly<Dictionary<readonly K[]>>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): Resolved<K, V | D> {

  const resolveValueBased = createValueBasedResolver(
    allKeys,
    isValidValue,
    defaultValue,
    OVERRIDE_KEY,
    specialKeys as never,
  );

  try {
    return resolveValueBased(value as never);
  } catch (e) {
    throw error(invalidOptionMessage(optionName, urlHash));
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
