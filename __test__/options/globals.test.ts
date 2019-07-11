import analize from "../tools/analize";

describe("globals option", () => {

  const cwd = process.cwd();

  const analizeWithGlobals = (globals: any) => analize(cwd, {
    browser: "browser.js",
    bundlib: { globals },
  });

  const analizeWithBuildGlobals = (globals: any) => analize(cwd, {
    browser: "browser.js",
    bundlib: { browser: { globals } },
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

  test("should throw on invalid per-build globals option", () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidGlobalsOptions.length);

    invalidGlobalsOptions.forEach((globals) => {
      expect(
        analizeWithBuildGlobals(globals),
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

  test("should work with array per-build globals option", async () => {

    const { output: { browser } } = await analizeWithBuildGlobals(["module1", "module2"]);

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

  test("should work with object per-build globals option", async () => {

    const globals = {
      module1: "mod1",
      module2: "mod2",
    };

    const { output: { browser } } = await analizeWithBuildGlobals(globals);

    expect(browser ? browser.globals : null)
      .toEqual(globals);

  });

  test("should set globals to null if globals option null", async () => {

    const { output: { browser } } = await analizeWithGlobals(null);

    expect(browser ? browser.globals : false)
      .toBeNull();

  });

  test("should set globals to null if per-build globals option null", async () => {

    const { output: { browser } } = await analizeWithBuildGlobals(null);

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

  test("should set per-build globals over top-level globals", async () => {

    const { output: { browser } } = await analize(cwd, {
      browser: "browser.js",
      bundlib: {
        globals: ["top-level"],
        browser: { globals: ["per-build"] },
      },
    });

    expect(browser ? browser.globals : false)
      .toEqual({ "per-build": "per-build" });

  });

});
