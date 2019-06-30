import { IsExternal } from "rollup";

function arrayToExternal(modules: string[]): IsExternal {

  const cache: Record<string, true> = {};

  return (source: string, _: string, isResolved: boolean) => {

    if (isResolved || source[0] === ".") {
      return;
    }

    return cache[source] || modules.some((moduleName) => {

      if (source === moduleName) {
        return (cache[source] = true);
      }

      const len = moduleName.length;

      if (source.substr(0, len) === moduleName && source[len].match(/^[/\\]$/)) {
        return (cache[source] = true);
      }

      return false;

    });
  };

}

export default arrayToExternal;
