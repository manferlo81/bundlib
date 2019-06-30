import analize from "../tools/analize";

describe("bin option", () => {

  const cwd = process.cwd();

  test("should throw on invalid bin option", () => {

    const invalidInputs = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidInputs.length);

    invalidInputs.forEach((bin) => {
      // @ts-ignore
      expect(analize(cwd, {
        bundlib: { bin },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on non typescript binary input option", () => {

    return expect(analize(cwd, {
      bundlib: { bin: "index.js" },
    })).rejects.toThrow(TypeError);

  });

  test("should read bin option", async () => {

    const analized = await analize(cwd, {
      bundlib: { bin: "src-bin/main.ts" },
    });

    expect(analized.input.bin).toMatch(/src-bin[/\\]main\.ts$/);

  });

});
