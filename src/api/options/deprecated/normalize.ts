import { isNull } from '../../type-check/basic';
import type { Nullable, TypeCheckFunction } from '../../types/helper-types';

export function normalizeDeprecatedOption<K extends string, T>(
  build: Nullable<{ [X in K]?: Nullable<T> }>,
  key: K,
  isValidValue: TypeCheckFunction<T>,
  def: T,
): T {

  if (!build) {
    return def;
  }

  const { [key]: value } = build;

  if (isNull(value) || !isValidValue(value)) {
    return def;
  }

  return value;

}
