function mapId({ map } = {}) {

  return {

    name: "map-id",

    resolveId(id) {

      const result = map && map[id];

      if (!result) {
        return;
      }

      if (typeof result === "string") {
        return result;
      }

      const { id: resultId, external } = result;
      return { id: resultId, external };

    },

  };

}

export default mapId;
