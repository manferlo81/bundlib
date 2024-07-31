import { isNullish } from '../../type-check/basic';
import type { AllowNullish, TypeCheckFunction } from '../../types/helper-types';

export function normalizeDeprecatedOption<K extends string, T>(
  build: AllowNullish<{ [X in K]?: AllowNullish<T> }>,
  key: K,
  isValidValue: TypeCheckFunction<T>,
  def: T,
): T {

  if (!build) {
    return def;
  }

  const { [key]: value } = build;

  if (isNullish(value) || !isValidValue(value)) {
    return def;
  }

  return value;

}
