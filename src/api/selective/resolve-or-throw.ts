import type { Resolved, Resolver } from 'selective-option';
import { error } from '../errors/error';
import { invalidOptionMessage } from '../errors/error-messages';

export function resolveOptionOrThrow<I, K extends string, V>(resolve: Resolver<K, V, I>, value: I, optionName: string): Resolved<K, V> {
  try {
    return resolve(value);
  } catch {
    throw error(invalidOptionMessage(optionName));
  }
}
