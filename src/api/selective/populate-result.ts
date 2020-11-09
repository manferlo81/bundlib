import { setProp } from '../tools/helpers';
import type { TypeCheckFunction } from '../types/helper-types';
import { populateWithAPIValue } from './populate-with-api';
import type { SelectiveResolved } from './types';

export function populateResult<K extends string, V>(
  type: unknown,
  value: V,
  result: SelectiveResolved<K, V>,
  isBuildType: TypeCheckFunction<K>,
): SelectiveResolved<K, V> | void {

  if (type === 'api') {
    return populateWithAPIValue(
      value,
      result,
    );
  }

  if (isBuildType(type)) {
    return setProp(
      type,
      value,
      result,
    );
  }

}
