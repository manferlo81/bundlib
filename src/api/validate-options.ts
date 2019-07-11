import keys from "./obj-keys";

export function invalidKeys(object: Record<string, any>, list: string[]): string[] | null {
  const invalid = keys(object).filter((key) => list.indexOf(key) === -1);
  return invalid.length ? invalid : null;
}
