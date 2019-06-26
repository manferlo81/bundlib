/** @type { import("rollup").PluginImpl } */
function mapId(options = {}) {

  return {

    name: "map-id",

    resolveId(moduleId) {

      const result = options && options[moduleId];

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
