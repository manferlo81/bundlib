import { keysToObject } from '../tools/helpers';
import { isNull } from '../type-check/basic';
import type { TypeCheckFunction } from '../types/helper-types';
import type { SelectiveResolved } from './types';

export function resolveValid<K extends string, V, D>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): SelectiveResolved<K, V | D> | void {

  if (isNull(value)) {
    return keysToObject(
      allKeys,
      defaultValue,
    );
  }

  if (isValidValue(value)) {
    return keysToObject(
      allKeys,
      value,
    );
  }

}
