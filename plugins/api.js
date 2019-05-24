export default (fromPath, toPath) => ({

  resolveId(id) {
    if (id === fromPath) {
      return {
        id: toPath,
        external: true,
      };
    }
  },

});
