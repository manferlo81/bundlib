require("../mock/mock-file-write");

const { resolve } = require("path");
const { bundlib } = require("../..");

describe("bundlib", () => {

  test("should generates files", async (done) => {

    const projectCwd = resolve(process.cwd(), "test/projects/1");
    const files = ["lib.js"].map(
      (filename) => resolve(projectCwd, filename)
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

  test("should generates files, with options", async (done) => {

    const projectCwd = resolve(process.cwd(), "test/projects/1");
    const files = ["lib.js"].map(
      (fn) => resolve(projectCwd, fn)
    );

    const writtenListener = jest.fn();

    const build = await bundlib(projectCwd, {
      dev: true,
      silent: true,
    });

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
