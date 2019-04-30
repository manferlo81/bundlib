const { bundlib } = require("../..");
const { resolve } = require("path");
const { cleanup, exist } = require("../test-helpers/fs");

describe("bundlib", () => {

  test("bundlib should generates 3 files", async (done) => {

    const projectCwd = resolve(process.cwd(), "test/projects/1");
    const files = ["lib.js", "lib.js.map", "lib.d.ts"].map(
      (fn) => resolve(projectCwd, fn)
    );

    cleanup(files);

    const build = await bundlib(projectCwd);

    build.on("BUILT", () => {
      exist(files);
      done();
    });

  }, 10000);

});
