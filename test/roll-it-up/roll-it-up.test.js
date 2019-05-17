require("../mock/mock-file-write");
const { resolve } = require("path");

const { rollItUp } = require("../..");
const createConfigs = require("../test-helpers/create-configs");

describe("roll-it-up", () => {

  test("roll-it-up should generates files", async (done) => {

    const projectCwd = resolve(process.cwd(), "test/projects/1");
    const files = ["lib.js"].map(
      (fn) => resolve(projectCwd, fn)
    );

    const configs = await createConfigs(projectCwd, true);
    const build = await rollItUp(configs);

    const writtenListener = jest.fn();
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
