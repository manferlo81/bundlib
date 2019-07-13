import { dirname, join as pathJoin, relative } from "path";
import { Plugin } from "rollup";
import slash from "slash";
import { keys, setProp } from "./helpers";

export function mapIdExternal(cwd: string, file: string, map: Record<string, string>): Plugin {

  const normalizedMap = keys(map).reduce<Record<string, string>>((result, source) => (
    setProp(
      slash(source),
      map[source],
      result,
    )
  ), {});

  return {

    name: "api",

    resolveId(moduleId, from) {

      const resolved = !from ? moduleId : pathJoin(dirname(from), moduleId);

      const target = normalizedMap[slash(resolved)]
        || normalizedMap[slash(pathJoin(resolved, ".ts"))]
        || normalizedMap[slash(pathJoin(resolved, "/index.ts"))];

      if (!target) {
        return null;
      }

      return {
        id: relative(
          dirname(file),
          target,
        ),
        external: true,
        moduleSideEffects: false,
      };
    },

  };

}

export default mapIdExternal;
