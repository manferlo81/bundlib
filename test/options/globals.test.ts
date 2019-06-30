import analize from "../tools/analize";

describe("globals option", () => {

  const cwd = process.cwd();

  test("should throw on invalid globals option", () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidGlobalsOptions.length);

    invalidGlobalsOptions.forEach((globals) => {
      // @ts-ignore
      expect(analize(cwd, {
        bundlib: { globals },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should work with array globals option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        globals: ["module1", "module2"],
      },
    });

    expect(analized.browser.globals).toEqual({
      module1: "module1",
      module2: "module2",
    });

  });

  test("should work with object globals option", async () => {

    const globals = {
      module1: "mod1",
      module2: "mod2",
    };

    const analized = await analize(cwd, {
      bundlib: { globals },
    });

    expect(analized.browser.globals).toEqual(globals);

  });

});
