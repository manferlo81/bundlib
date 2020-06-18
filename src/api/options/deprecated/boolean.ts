import { isNull } from '../../type-check/basic';
import type { Nullable } from '../../types/helper-types';

export function normalizeBooleanOption<K extends string>(
  build: Nullable<{ [X in K]?: Nullable<boolean> }>,
  key: K,
  def: boolean,
): boolean {

  if (!build) {
    return def;
  }

  const { [key]: value } = build;

  if (isNull(value)) {
    return def;
  }

  return !!value;

}
