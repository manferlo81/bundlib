import { dirname } from "path";
import { Plugin, ResolvedId } from "rollup";

interface Map {
  src: string;
  dest: string;
  external?: boolean | void;
}

interface PluginOptions {
  map: Map;
}

const plugin = ({ map }: PluginOptions): Plugin => {

  const normalizedMap = [map];

  return {

    name: "map-id",

    resolveId(id, parent): ResolvedId | void {

      if (id === "../src") {
        return {
          id: "..",
          external: true,
        };
      }

      // let filename: string = id;

      // if (parent) {
      //   filename = require.resolve(filename, {
      //     paths: [
      //       dirname(parent),
      //     ],
      //   });
      // }

      // const { src, dest, external } = normalizedMap[0];

      // if (filename === src) {
      //   return {
      //     id: dest,
      //     external,
      //   };
      // }

    },

  };

};

export default plugin;
