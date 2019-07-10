import analize from "../tools/analize";

describe("min option", () => {

  const cwd = process.cwd();

  const analizeWithMin = (min: any) => analize(cwd, {
    main: "lib.js",
    module: "lib.js",
    browser: "lib.js",
    bin: "lib.js",
    bundlib: { min },
  });

  test("should throw on invalid min option", () => {

    const invalidMinOptions = [
      1,
      "string",
      ["string"],
    ];

    expect.assertions(invalidMinOptions.length);

    invalidMinOptions.forEach((min) => {
      // @ts-ignore
      expect(analize(cwd, {
        bundlib: { min },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should work with string main min option", async () => {

    const analized = await analizeWithMin("main");

    expect(analized.output.main ? analized.output.main.min : null)
      .toEqual(true);
    expect(analized.output.module ? analized.output.module.min : null)
      .toEqual(false);
    expect(analized.output.browser ? analized.output.browser.min : null)
      .toEqual(false);
    expect(analized.output.bin ? analized.output.bin.min : null)
      .toEqual(false);

  });

  test("should work with array min option", async () => {

    const analized = await analizeWithMin(["module", "bin"]);

    expect(analized.output.main ? analized.output.main.min : null)
      .toEqual(false);
    expect(analized.output.module ? analized.output.module.min : null)
      .toEqual(true);
    expect(analized.output.browser ? analized.output.browser.min : null)
      .toEqual(false);
    expect(analized.output.bin ? analized.output.bin.min : null)
      .toEqual(true);

  });

  test("should work with true as min option", async () => {

    const analized = await analizeWithMin(true);

    expect(analized.output.main ? analized.output.main.min : null)
      .toEqual(true);
    expect(analized.output.module ? analized.output.module.min : null)
      .toEqual(true);
    expect(analized.output.browser ? analized.output.browser.min : null)
      .toEqual(true);
    expect(analized.output.bin ? analized.output.bin.min : null)
      .toEqual(true);

  });

});
