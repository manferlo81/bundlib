import { keys } from "./helpers";
import { InList } from "./in-list";

export function invalidKeys(object: Record<string, any>, list: string[]): string[] | null {
  const invalid = keys(object).filter(
    (key) => list.indexOf(key) === -1,
  );
  return invalid.length ? invalid : null;
}

export function keysInList<M extends string>(
  obj: Record<string, any>,
  inList: InList<M>,
): obj is Partial<Record<M, any>> {
  return keys(obj).every(inList);
}
