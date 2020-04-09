import { dirname, join as pathJoin, relative, resolve } from 'path';
import { Plugin } from 'rollup';
import slash from 'slash';
import { error } from '../errors';
import { Dictionary } from '../helper-types';
import { keys, setProp } from '../helpers';

export function apiPlugin(cwd: string, outputDir: string, map: Dictionary<string>): Plugin {

  const resolvedMap = keys(map).reduce<Dictionary<string>>((resolvedMap, source) => {
    return setProp(
      resolve(cwd, source),
      resolve(cwd, map[source]),
      resolvedMap,
    );
  }, {});

  // TODO: Fix extensions
  const extensions = ['.ts', '.js'];

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

      const sourceWithIndex = pathJoin(resolved, `index${ext}`);
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

      const target = findTarget(
        pathJoin(
          dirname(from),
          moduleId,
        ),
      );

      if (!target) {
        return null;
      }

      const relativeTarget = slash(
        relative(
          outputDir,
          target,
        ),
      );

      if (!relativeTarget) {
        throw error(`Error while resolving ${moduleId} from ${from}`, Error);
      }

      return {
        id: relativeTarget.startsWith('.') ? relativeTarget : `./${relativeTarget}`,
        external: true,
        moduleSideEffects: false,
      };
    },

  };

}
