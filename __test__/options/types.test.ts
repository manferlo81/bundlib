import analize from "../tools/analize";

describe("types option", () => {

  const cwd = process.cwd();

  const analizeWithMain = (types: any) => analize(cwd, {
    types: "out.js",
    bundlib: { types },
  });

  test("should throw on invalid types option", () => {

    const invalidMain = [
      1,
      true,
      { invalid: true },
      { api: 10, bin: 11 },
    ];

    expect.assertions(invalidMain.length);

    invalidMain.forEach((types) => {
      expect(
        analizeWithMain(types),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should prevent types generation if types = false", async () => {

    const { output: { types } } = await analizeWithMain(false);

    expect(types)
      .toBeNull();

  });

});
