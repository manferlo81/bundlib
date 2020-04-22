import { Nullable, TypeCheckFunction } from '../../helper-types';
import { isNull } from '../../type-check/basic';

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
