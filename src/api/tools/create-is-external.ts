import type { IsExternal } from 'rollup';
import type { Dictionary, Nullable } from '../types/helper-types';
import { hasOwn, keys } from './helpers';

const isNotExternal: IsExternal = () => false;

export function createIsExternal(...args: Array<Nullable<readonly string[]>>): IsExternal {

  // filter arguments for "nullish" dependencies
  const filtered = args.filter((dep): dep is string[] => {
    return !!dep;
  });

  // if no dependencies passed, return function that always returns false (not external)
  if (filtered.length === 0) {
    return isNotExternal;
  }

  // create external data
  const externalData = filtered.reduce<Dictionary<true>>(
    (result, dependencies) => {
      return dependencies.reduce((result, dependencyName) => {
        return { ...result, [dependencyName]: true };
      }, result);
    },
    {},
  );

  // get external data kays
  const externalList = keys(externalData);

  // if there is not external data return function that always returns false (not external)
  if (externalList.length === 0) {
    return isNotExternal;
  }

  // create cache object
  const cache: Dictionary<boolean> = {};

  // return IsExternal function
  return (source, importer, isResolved) => {

    // if it's resolved or is local file, return false (not external)
    if (isResolved || source.startsWith('.')) {
      return false;
    }

    // if found in cache, return cached value
    if (hasOwn.call(cache, source)) {
      return cache[source];
    }

    // if found in external data, return true (is external) and cache result
    if (externalData[source]) {
      return cache[source] = true;
    }

    // search external data
    const { length: listLength } = externalList;
    for (let i = 0; i < listLength; i++) {

      const externalModuleName = externalList[i];
      const { length: externalModuleNameLength } = externalModuleName;

      // if source is a module sub-file ex: "my-module/file.js"
      if (/^[/\\]$/.test(source[externalModuleNameLength])) {

        // truncate source filename to match external module name length
        const truncatedSource = source.substring(0, externalModuleNameLength);

        // if found in cache, return cached value
        if (hasOwn.call(cache, truncatedSource)) {
          return cache[truncatedSource];
        }

        // if module name matches, return true (is external) and cache result
        if (truncatedSource === externalModuleName) {
          return cache[truncatedSource] = cache[source] = true;
        }

      }

    }

    // if source not found on external data, return false (not external) and cache result
    return cache[source] = false;

  };

}
