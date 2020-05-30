import { IsExternal } from 'rollup';
import { Dictionary, Nullable } from '../helper-types';
import { isArray } from '../type-check/basic';
import { hasOwn, keys, keysToObject } from './helpers';

export function createIsExternal(...dependencies: Array<Nullable<string[] | Dictionary<unknown>>>): IsExternal {

  const filtered = dependencies.filter((dep): dep is string[] | Dictionary<unknown> => !!dep);

  if (!filtered.length) {
    return () => false;
  }

  const asObj = filtered.reduce<Dictionary<unknown>>(
    (result, dep) => isArray(dep) ? keysToObject(dep, true as unknown, result) : { ...result, ...dep },
    {},
  );

  const asList = keys(asObj);

  const cache: Dictionary<boolean> = {};

  return (source: string, importer: unknown, isResolved: boolean): boolean => {

    if (isResolved || source.startsWith('.')) {
      return false;
    }

    if (hasOwn.call(cache, source)) {
      return cache[source];
    }

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
