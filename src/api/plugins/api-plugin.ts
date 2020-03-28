import { dirname, join as pathJoin, relative, resolve } from 'path';
import { Plugin } from 'rollup';
import slash from 'slash';
import { Dictionary } from '../helper-types';
import { keys, setProp } from '../helpers';

export function mapIdExternal(cwd: string, outputDir: string, map: Dictionary<string>): Plugin {

  const normalizedMap = keys(map).reduce<Dictionary<string>>((result, source) => (
    setProp(
      slash(resolve(cwd, source)),
      resolve(cwd, map[source]),
      result,
    )
  ), {});

  return {

    name: 'api',

    resolveId(moduleId, from) {

      const resolved = !from ? moduleId : pathJoin(dirname(from), moduleId);

      const target = normalizedMap[slash(resolved)]
        || normalizedMap[slash(resolved + '.ts')]
        || normalizedMap[slash(pathJoin(resolved, 'index.ts'))];

      if (!target) {
        return null;
      }

      const relativeTarget = relative(
        outputDir,
        target,
      );

      return {
        id: (
          !relativeTarget
            ? '.'
            : relativeTarget.startsWith('.')
              ? relativeTarget
              : pathJoin('.', relativeTarget)
        ),
        external: true,
        moduleSideEffects: false,
      };
    },

  };

}

export default mapIdExternal;
