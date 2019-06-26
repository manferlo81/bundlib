import { dirname, isAbsolute, join, normalize } from "path";
import { Plugin, PluginImpl } from "rollup";

interface MapDictionary {
  [X: string]: string | {
    id: string;
    external: boolean;
  };
}

interface MapIdOptions {
  cwd?: string;
  map?: MapDictionary;
}

function resolveId(id: string, cwd: string, from: string | undefined) {
  return isAbsolute(id) ? id : normalize(join(
    from ? dirname(from) : cwd,
    id,
  ));
}

function mapId({ cwd = process.cwd(), map = {} }: MapIdOptions = {}): Plugin {

  return {

    name: "map-id",

    resolveId(moduleId, from) {

      const resolved = resolveId(moduleId, cwd, from);
      const result = map[resolved] || map[join(resolved, ".ts")] || map[join(resolved, "/index.ts")];

      if (!result) {
        return;
      }

      if (typeof result === "string") {
        return result;
      }

      const { id, external } = result;
      return { id, external };

    },

  };

}

export default mapId as PluginImpl<MapIdOptions>;
