// @ts-check

const analize = require("../tools/analize");

describe("binInput option", () => {

  const cwd = process.cwd();

  test("should throw on invalid binInput option", () => {

    const invalidInputs = [
      1,
      true,
      false,
    ];

    invalidInputs.forEach((binInput) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { binInput },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on non typescript binary input option", async () => {

    expect(analize(cwd, {
      bundlib: { binInput: "index.js" },
    })).rejects.toThrow(TypeError);

  });

  test("should read binInput option", async () => {

    const analized = await analize(cwd, {
      bundlib: { binInput: "src-bin/main.ts" },
    });

    expect(analized.binInput).toMatch(/src-bin[/\\]main\.ts$/);

  });

});
