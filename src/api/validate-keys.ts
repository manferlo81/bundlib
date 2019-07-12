import keys from "./obj-keys";

export function invalidKeys(object: Record<string, any>, list: string[]): string[] | null {
  const invalid = keys(object).filter((key) => (
    list.indexOf(key) === -1
  ));
  return invalid.length ? invalid : null;
}

export function listInList<T extends string>(input: string[], model: T[]): input is T[] {
  return input.every((str) => (
    (model as string[]).indexOf(str) >= 0
  ));
}

export function allKeysInList<K extends string>(
  object: Record<string, any>,
  model: K[],
): boolean {
  return listInList<K>(
    keys(object),
    model,
  );
}
