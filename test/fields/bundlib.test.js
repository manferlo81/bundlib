// @ts-check

const analize = require("../tools/analize");

describe("package.json bundlib field", () => {

  const cwd = process.cwd();

  test("should throw on invalid bundlib field", () => {

    const invalidBundlibOptions = [
      1,
      [],
    ];

    invalidBundlibOptions.forEach((bundlib) => {
      // @ts-ignore
      expect(analize(cwd, { bundlib })).rejects.toThrow(TypeError);
    });

  });

});
