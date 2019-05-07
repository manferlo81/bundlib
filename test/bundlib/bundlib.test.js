const { resolve } = require("path");

require("../mock/mock-file-write");
const { bundlib } = require("../..");

describe("bundlib", () => {

  test("bundlib should generates 3 files", async (done) => {

    const projectCwd = resolve(process.cwd(), "test/projects/1");
    const files = ["lib.js", "lib.d.ts"].map(
      (fn) => resolve(projectCwd, fn)
    );

    const writtenListener = jest.fn();

    const build = await bundlib(projectCwd);

    build.on("WRITTEN", writtenListener);
    build.on("BUILT", () => {

      expect(writtenListener).toHaveBeenCalledTimes(files.length);
      files.forEach((filename, index) => {
        expect(writtenListener).toHaveBeenNthCalledWith(index + 1, filename);
      });

      done();

    });

  }, 10000);

});
