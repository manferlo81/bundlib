import { isArray } from '../type-check/basic';

export type MultilevelArray<T> = ReadonlyArray<T | MultilevelArray<T>>;

export function flattenMultilevel<T>(array: MultilevelArray<T>, target: T[] = []): T[] {
  return array.reduce<T[]>(
    (acc, item) => {

      if (isArray<MultilevelArray<T>>(item)) {
        return flattenMultilevel(item, acc);
      }

      acc.push(item);
      return acc;

    },
    target,
  );
}
