import { dirname, join as pathJoin, relative, resolve } from 'path';
import { Plugin } from 'rollup';
import slash from 'slash';
import { Dictionary } from '../helper-types';
import { keys, setProp } from '../helpers';

export function mapIdExternal(cwd: string, outputDir: string, map: Dictionary<string>): Plugin {

  const normalizedMap = keys(map).reduce<Dictionary<string>>(
    (result, source) => setProp(
      slash(resolve(cwd, source)),
      resolve(cwd, map[source]),
      result,
    ),
    {},
  );

  if (process.env.CI) {
    console.log('map', normalizedMap);
  }

  // TODO: Fix extensions
  const extensions = ['.ts', '.js'];

  function findTarget(resolved: string): string | void {

    const slashed = slash(resolved);

    if (normalizedMap[slashed]) {
      return normalizedMap[slashed];
    }

    for (let i = 0; i < extensions.length; i++) {

      const ext = extensions[i];

      const sourceWithExt = slashed + ext;
      if (normalizedMap[sourceWithExt]) {
        return normalizedMap[sourceWithExt];
      }

      const sourceWithIndex = slash(pathJoin(resolved, `index${ext}`));
      if (normalizedMap[sourceWithIndex]) {
        return normalizedMap[sourceWithIndex];
      }

    }

  }

  return {

    name: 'api',

    resolveId(moduleId, from) {

      if (!from) {
        return null;
      }

      const resolved = pathJoin(
        dirname(from),
        moduleId,
      );

      if (process.env.CI) {
        console.log('resolved', resolved);
        console.log('resolved (slash)', slash(resolved));
      }

      const target = findTarget(resolved);

      if (!target) {
        return null;
      }

      const relativeTarget = relative(
        outputDir,
        target,
      );

      const id = !relativeTarget
        ? '.'
        : slash(relativeTarget.startsWith('.') ? relativeTarget : `./${relativeTarget}`);

      return {
        id,
        external: true,
        moduleSideEffects: false,
      };
    },

  };

}
