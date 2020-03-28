import { IsExternal } from 'rollup';
import hasOwn from './has-own';
import { Dictionary, StrictNullable } from './helper-types';

function arrayToExternal(...modules: Array<StrictNullable<string[]>>): IsExternal {

  const filtered = modules.reduce<string[]>(
    (result, list) => list ? [...result, ...list] : result,
    [],
  );

  if (!filtered.length) {
    return () => false;
  }

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

    return cache[source] = filtered.some((moduleName): (boolean | void) => {

      if (source === moduleName) {
        return true;
      }

      const len = moduleName.length;

      return (source.substr(0, len) === moduleName) && /^[/\\]$/.test(source[len]);

    });

  };

}

export default arrayToExternal;
