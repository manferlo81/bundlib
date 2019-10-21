import { keys } from "./helpers";
import { createInList } from "./in-list";

export function invalidKeys(object: Record<string, any>, list: string[]): string[] | null {
  const invalid = keys(object).filter(
    (key) => list.indexOf(key) === -1,
  );
  return invalid.length ? invalid : null;
}

export function listInList<M extends string>(input: string[], ...model: M[]): input is M[] {
  return input.every(createInList(...model));
}

export function keysInList<M extends string>(obj: Record<string, any>, ...model: M[]): obj is Partial<Record<M, any>> {
  return listInList<M>(
    keys(obj),
    ...model,
  );
}
