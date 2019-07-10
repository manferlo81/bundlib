import analize from "../tools/analize";

describe("esModule option", () => {

  const cwd = process.cwd();

  const analizeWithESModule = (esModule: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { esModule },
  });

  test("should read truthy esModule option as set as boolean", async () => {

    const analized = await analizeWithESModule(1);

    expect(analized.output.main ? analized.output.main.esModule : null)
      .toBe(true);
    expect(analized.output.browser ? analized.output.browser.esModule : null)
      .toBe(true);
    expect(analized.output.bin ? analized.output.bin.esModule : null)
      .toBe(true);

  });

  test("should read falsy esModule option as set as boolean", async () => {

    const analized = await analizeWithESModule(0);

    expect(analized.output.main ? analized.output.main.esModule : null)
      .toBe(false);
    expect(analized.output.browser ? analized.output.browser.esModule : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.esModule : null)
      .toBe(false);

  });

  test("should read true esModule option as set as boolean", async () => {

    const analized = await analizeWithESModule(true);

    expect(analized.output.main ? analized.output.main.esModule : null)
      .toBe(true);
    expect(analized.output.browser ? analized.output.browser.esModule : null)
      .toBe(true);
    expect(analized.output.bin ? analized.output.bin.esModule : null)
      .toBe(true);

  });

  test("should read false esModule option as set as boolean", async () => {

    const analized = await analizeWithESModule(false);

    expect(analized.output.main ? analized.output.main.esModule : null)
      .toBe(false);
    expect(analized.output.browser ? analized.output.browser.esModule : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.esModule : null)
      .toBe(false);

  });

});
