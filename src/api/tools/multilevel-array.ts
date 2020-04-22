import { isArray } from '../type-check/basic';

export type MultilevelArray<T> = Array<T | MultilevelArray<T>>;

export function flattenMultilevel<T>(array: MultilevelArray<T>, target: T[] = []): T[] {
  return array.reduce<T[]>(
    (acc, item) => {

      if (isArray(item)) {
        return flattenMultilevel(item, acc);
      }

      acc.push(item);
      return acc;

    },
    target,
  );
}
