import type { KeyList, Resolved, SpecialKeys } from 'selective-option';
import { createValueBasedResolver } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';
import type { TypeCheckFunction } from '../types/helper-types';
import { OVERRIDE_KEY } from './consts';

export function resolveValueBasedSelectiveOption<K extends string, V, D = V>(
  value: unknown,
  allKeys: KeyList<K>,
  specialKeys: SpecialKeys<string, K>,
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
    specialKeys,
  );

  try {
    return resolveValueBased(value as never);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    throw error(invalidOptionMessage(optionName, urlHash));
  }

}
