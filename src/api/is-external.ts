import { IsExternal } from 'rollup';
import { Dictionary, Nullable } from './helper-types';
import { hasOwn, keys, keysToObject } from './helpers';
import { isArray } from './type-check/type-check';

export function createIsExternal(...dependencies: Array<Nullable<string[] | Dictionary<unknown>>>): IsExternal {

  const filtered = dependencies.filter((dep): dep is string[] | Dictionary<unknown> => !!dep);

  if (!filtered.length) {
    return () => false;
  }

  const asObj = filtered.reduce<Dictionary<unknown>>(
    (result, dep) => isArray(dep) ? { ...result, ...keysToObject(dep, true) } : { ...result, ...dep },
    {},
  );

  const asList = filtered.reduce<string[]>(
    (result, dep) => isArray(dep) ? [...result, ...dep] : [...result, ...keys(dep)],
    [],
  );

  const cache: Dictionary<boolean> = {};

  return (source: string, importer: unknown, isResolved: boolean) => {

    // ignore local and resolved modules

    if (isResolved || source.startsWith('.')) {
      return;
    }

    // return from cache if present

    if (hasOwn.call(cache, source)) {
      return cache[source];
    }

    // set cached value

    if (asObj[source]) {
      return cache[source] = true;
    }

    const l = asList.length;
    for (let i = 0; i < l; i++) {

      const moduleName = asList[i];
      const len = moduleName.length;
      const partialSource = source.substr(0, len);

      if (/^[/\\]$/.test(source[len])) {

        if (hasOwn.call(cache, partialSource)) {
          return cache[partialSource];
        }

        if (partialSource === moduleName) {
          return cache[partialSource] = cache[source] = true;
        }

      }

    }

    return cache[source] = false;

  };

}
