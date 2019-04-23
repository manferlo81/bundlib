import { Plugin } from "rollup";

const removeEmptyLines = (eol = "\r\n"): Plugin => ({

  name: "remove-empty-lines",

  renderChunk(code) {
    return code
      .replace(/\r/g, "\n")
      .replace(/\n+/g, "\n")
      .replace(/\n+\s*\n+/, eol);
  },

});

export default removeEmptyLines;
