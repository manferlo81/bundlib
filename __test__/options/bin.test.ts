import analize from "../tools/analize";

describe("bin option", () => {

  const cwd = process.cwd();

  test("should throw on invalid bin option", () => {

    const invalidInputs = [
      1,
      true,
      { invalid: 100 },
    ];

    expect.assertions(invalidInputs.length);

    invalidInputs.forEach((bin) => {
      // @ts-ignore
      expect(analize(cwd, {
        bundlib: { bin },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should read legacy binary input file bin option", async () => {

    const analized = await analize(cwd, {
      bundlib: { bin: "src-bin/main.ts" },
    });

    expect(analized.input.bin).toMatch(/src-bin[/\\]main\.ts$/);

  });

});
