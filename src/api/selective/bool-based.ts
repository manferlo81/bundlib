import type { KeyList, Resolved, SpecialKeys } from 'selective-option';
import { createBoolBasedResolver } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';
import type { TypeCheckFunction } from '../types/helper-types';
import { OVERRIDE_KEY } from './consts';

export function resolveBoolBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: KeyList<K>,
  specialKeys: SpecialKeys<string, K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  optionName: string,
  urlHash?: string,
): Resolved<K, boolean | V | D> {

  const resolveBoolBased = createBoolBasedResolver(
    allKeys,
    isValidValue,
    defaultValue,
    OVERRIDE_KEY,
    specialKeys,
  );

  try {
    return resolveBoolBased(value as never);
  } catch (e) {
    throw error(invalidOptionMessage(optionName, urlHash));
  }

}
