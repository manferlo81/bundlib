import analize from "../tools/analize";

describe("interop option", () => {

  const cwd = process.cwd();

  const analizeWithInterop = (interop: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { interop },
  });

  const analizeWithBuildInterop = (field: string, interop: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { interop: !interop, [field]: { interop } },
  });

  test("should read truthy interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithInterop(1);

    expect(main ? main.interop : null)
      .toBe(true);
    expect(browser ? browser.interop : null)
      .toBe(true);
    expect(bin ? bin.interop : null)
      .toBe(true);

  });

  test("should read falsy interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithInterop(0);

    expect(main ? main.interop : null)
      .toBe(false);
    expect(browser ? browser.interop : null)
      .toBe(false);
    expect(bin ? bin.interop : null)
      .toBe(false);

  });

  test("should read true interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithInterop(true);

    expect(main ? main.interop : null)
      .toBe(true);
    expect(browser ? browser.interop : null)
      .toBe(true);
    expect(bin ? bin.interop : null)
      .toBe(true);

  });

  test("should read false interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithInterop(false);

    expect(main ? main.interop : null)
      .toBe(false);
    expect(browser ? browser.interop : null)
      .toBe(false);
    expect(bin ? bin.interop : null)
      .toBe(false);

  });

  test("should read truthy per-build interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildInterop("main", 1);

    expect(main ? main.interop : null)
      .toBe(true);
    expect(browser ? browser.interop : null)
      .toBe(false);
    expect(bin ? bin.interop : null)
      .toBe(false);

  });

  test("should read falsy per-build interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildInterop("browser", 0);

    expect(main ? main.interop : null)
      .toBe(true);
    expect(browser ? browser.interop : null)
      .toBe(false);
    expect(bin ? bin.interop : null)
      .toBe(true);

  });

  test("should read true per-build interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildInterop("bin", true);

    expect(main ? main.interop : null)
      .toBe(false);
    expect(browser ? browser.interop : null)
      .toBe(false);
    expect(bin ? bin.interop : null)
      .toBe(true);

  });

  test("should read false per-build interop option as set as boolean", async () => {

    const { output: { main, browser, bin } } = await analizeWithBuildInterop("main", false);

    expect(main ? main.interop : null)
      .toBe(false);
    expect(browser ? browser.interop : null)
      .toBe(true);
    expect(bin ? bin.interop : null)
      .toBe(true);

  });

  test("should read per-build interop option over top-level one", async () => {

    const { output: { main, browser, bin } } = await analize(cwd, {
      main: "main.js",
      browser: "browser.js",
      bin: "bin.js",
      bundlib: {
        interop: true,
        main: { interop: false },
        browser: { interop: false },
        bin: { interop: false },
      },
    });

    expect(main ? main.interop : null)
      .toBe(false);
    expect(browser ? browser.interop : null)
      .toBe(false);
    expect(bin ? bin.interop : null)
      .toBe(false);

  });

});
