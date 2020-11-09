import { keysToObject } from '../tools/helpers';
import { isNull } from '../type-check/basic';
import type { TypeCheckFunction } from '../types/helper-types';
import type { SelectiveResolved } from './types';

export function resolveValid<K extends string, V>(
  value: unknown,
  allKeys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): SelectiveResolved<K, V> | void {

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
