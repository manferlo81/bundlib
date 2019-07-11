import analize from "../tools/analize";

describe("esModule option", () => {

  const cwd = process.cwd();

  const analizeWithESModule = (esModule: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { esModule },
  });

  const analizeWithBuildESModule = (field: string, esModule: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { esModule: !esModule, [field]: { esModule } },
  });

  test("should read truthy esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithESModule(1);

    expect(main ? main.esModule : null)
      .toBe(true);
    expect(browser ? browser.esModule : null)
      .toBe(true);
    expect(bin ? bin.esModule : null)
      .toBe(true);

  });

  test("should read falsy esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithESModule(0);

    expect(main ? main.esModule : null)
      .toBe(false);
    expect(browser ? browser.esModule : null)
      .toBe(false);
    expect(bin ? bin.esModule : null)
      .toBe(false);

  });

  test("should read true esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithESModule(true);

    expect(main ? main.esModule : null)
      .toBe(true);
    expect(browser ? browser.esModule : null)
      .toBe(true);
    expect(bin ? bin.esModule : null)
      .toBe(true);

  });

  test("should read false esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithESModule(false);

    expect(main ? main.esModule : null)
      .toBe(false);
    expect(browser ? browser.esModule : null)
      .toBe(false);
    expect(bin ? bin.esModule : null)
      .toBe(false);

  });

  test("should read truthy build esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildESModule("main", 1);

    expect(main ? main.esModule : null)
      .toBe(true);
    expect(browser ? browser.esModule : null)
      .toBe(false);
    expect(bin ? bin.esModule : null)
      .toBe(false);

  });

  test("should read falsy build esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildESModule("browser", 0);

    expect(main ? main.esModule : null)
      .toBe(true);
    expect(browser ? browser.esModule : null)
      .toBe(false);
    expect(bin ? bin.esModule : null)
      .toBe(true);

  });

  test("should read true build esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildESModule("bin", true);

    expect(main ? main.esModule : null)
      .toBe(false);
    expect(browser ? browser.esModule : null)
      .toBe(false);
    expect(bin ? bin.esModule : null)
      .toBe(true);

  });

  test("should read false build esModule option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildESModule("main", false);

    expect(main ? main.esModule : null)
      .toBe(false);
    expect(browser ? browser.esModule : null)
      .toBe(true);
    expect(bin ? bin.esModule : null)
      .toBe(true);

  });

  test("should read per-build esModule option over top-level one", async () => {

    const { output: { main, browser, bin } } = await analize(cwd, {
      main: "main.js",
      browser: "browser.js",
      bin: "bin.js",
      bundlib: {
        esModule: true,
        main: { esModule: false },
        browser: { esModule: false },
        bin: { esModule: false },
      },
    });

    expect(main ? main.esModule : null)
      .toBe(false);
    expect(browser ? browser.esModule : null)
      .toBe(false);
    expect(bin ? bin.esModule : null)
      .toBe(false);

  });

});
