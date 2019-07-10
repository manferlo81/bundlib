import { isNull } from "./type-check";
import { Nullable } from "./types";

export function normalizeBuildFlag<K extends string>(
  build: Nullable<Partial<Record<K, any>>>,
  key: K,
  def: boolean,
): boolean {
  return !build || isNull(build[key]) ? def : !!build[key];
}
