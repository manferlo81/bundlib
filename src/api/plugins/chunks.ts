import { dirname, join, relative, resolve } from 'path';
import type { Plugin } from 'rollup';
import slash from 'slash';
import { keys } from '../tools/helpers';
import type { Dictionary } from '../types/helper-types';

export function pluginChunks(cwd: string, outputDir: string, extensions: string[], map: Dictionary<string>): Plugin {

  const resolvedMap = keys(map).reduce<Dictionary<string>>(
    (resolvedMap, source) => {
      const target = map[source];
      const value = slash(
        relative(
          outputDir,
          resolve(cwd, target),
        ),
      );
      return value
        ? {
          ...resolvedMap,
          [resolve(cwd, source)]: value.startsWith('.') ? value : `./${value}`,
        }
        : resolvedMap;
    },
    {},
  );

  function findTarget(resolved: string): string | void {

    if (resolvedMap[resolved]) {
      return resolvedMap[resolved];
    }

    for (let i = 0; i < extensions.length; i++) {

      const ext = extensions[i];

      const sourceWithExt = resolved + ext;
      if (resolvedMap[sourceWithExt]) {
        return resolvedMap[sourceWithExt];
      }

      const sourceWithIndex = join(resolved, `index${ext}`);
      if (resolvedMap[sourceWithIndex]) {
        return resolvedMap[sourceWithIndex];
      }

    }

  }

  return {

    name: 'api',

    resolveId(moduleId, from) {

      if (!from) {
        return null;
      }

      const id = findTarget(
        join(
          dirname(from),
          moduleId,
        ),
      );

      return id ? { id, external: true, moduleSideEffects: false } : null;

    },

  };

}
