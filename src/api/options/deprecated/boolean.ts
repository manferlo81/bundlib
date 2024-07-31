import { isNullish } from '../../type-check/basic';
import type { AllowNullish } from '../../types/helper-types';

export function normalizeBooleanOption<K extends string>(
  build: AllowNullish<{ [X in K]?: AllowNullish<boolean> }>,
  key: K,
  def: boolean,
): boolean {

  if (!build) return def;

  const { [key]: value } = build;

  if (isNullish(value)) return def;

  return !!value;

}
