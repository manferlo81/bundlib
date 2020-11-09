import { keysToObject } from '../tools/helpers';
import { API_BUILD_KEYS } from './consts';
import type { SelectiveResolved } from './types';

export function populateWithAPIValue<T>(value: T, result: SelectiveResolved<string, T>): SelectiveResolved<string, T> {
  return keysToObject(
    API_BUILD_KEYS,
    value,
    result,
  );
}
