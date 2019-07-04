import analize from "../tools/analize";

describe("input option", () => {

  const cwd = process.cwd();

  test("should throw on invalid input option", () => {

    const invalidInputs = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidInputs.length);

    invalidInputs.forEach((input) => {
      // @ts-ignore
      expect(analize(cwd, {
        bundlib: { input },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should read input option", async () => {

    const analized = await analize(cwd, {
      bundlib: { input: "src/main.ts" },
    });

    expect(analized.input.api).toMatch(/src[/\\]main\.ts$/);

  });

});
