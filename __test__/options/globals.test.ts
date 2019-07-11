import analize from "../tools/analize";

describe("globals option", () => {

  const cwd = process.cwd();

  const analizeWithGlobals = (globals: any) => analize(cwd, {
    browser: "browser.js",
    bundlib: { globals },
  });

  test("should throw on invalid globals option", () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidGlobalsOptions.length);

    invalidGlobalsOptions.forEach((globals) => {
      expect(
        analizeWithGlobals(globals),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should work with array globals option", async () => {

    const { output: { browser } } = await analizeWithGlobals(["module1", "module2"]);

    expect(browser ? browser.globals : null)
      .toEqual({
        module1: "module1",
        module2: "module2",
      });

  });

  test("should work with object globals option", async () => {

    const globals = {
      module1: "mod1",
      module2: "mod2",
    };

    const { output: { browser } } = await analizeWithGlobals(globals);

    expect(browser ? browser.globals : null)
      .toEqual(globals);

  });

  test("should set globals to null if globals option null", async () => {

    const { output: { browser } } = await analizeWithGlobals(null);

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test("should set globals to null if no globals option set", async () => {

    const { output: { browser } } = await analize(cwd, {
      browser: "browser.js",
      bundlib: {},
    });

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

});
