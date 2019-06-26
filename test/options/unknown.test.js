// @ts-check

const analize = require("../tools/analize");

describe("unknown options", () => {

  const cwd = process.cwd();

  test("should throw on unknown option", () => {

    const invalidOptions = [
      "iife",
      "amd",
      "umd",
      "option1",
      "option2",
    ];

    invalidOptions.forEach((option) => {
      expect(analize(cwd, {
        bundlib: { [option]: true },
      })).rejects.toThrow(TypeError);
    });

  });

});
