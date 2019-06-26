// @ts-check

const analize = require("../tools/analize");

describe("min option", () => {

  const cwd = process.cwd();

  test("should throw on invalid min option", () => {

    const invalidMinOptions = [
      1,
      "string",
      ["string"],
    ];

    invalidMinOptions.forEach((min) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { min },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should work with string min option", async () => {

    const analizeWithStringMin = (min) => analize(cwd, {
      bundlib: { min },
    });

    const analizedWithMain = await analizeWithStringMin("main");
    expect(analizedWithMain.minify).toEqual({
      main: true,
      module: false,
      browser: false,
    });

    const analizedWithModule = await analizeWithStringMin("module");
    expect(analizedWithModule.minify).toEqual({
      main: false,
      module: true,
      browser: false,
    });

    const analizedWithBrowser = await analizeWithStringMin("browser");
    expect(analizedWithBrowser.minify).toEqual({
      main: false,
      module: false,
      browser: true,
    });

  });

  test("should work with array min option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        min: ["main", "module", "browser"],
      },
    });

    expect(analized.minify).toEqual({
      main: true,
      module: true,
      browser: true,
    });

  });

  test("should work with true as min option", async () => {

    const analized = await analize(cwd, {
      bundlib: { min: true },
    });

    expect(analized.minify).toEqual({
      main: true,
      module: true,
      browser: true,
    });

  });

});
