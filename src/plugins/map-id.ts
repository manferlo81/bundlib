import { Plugin } from "rollup";

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

function mapId({ cwd = process.cwd(), map = {} }: MapIdOptions = {}): Plugin {

  return {

    name: "map-id",

    resolveId(moduleId) {

      const result = map && map[moduleId];

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

export default mapId;
