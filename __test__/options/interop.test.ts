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

    const analized = await analizeWithInterop(1);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(true);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(true);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(true);

  });

  test("should read falsy interop option as set as boolean", async () => {

    const analized = await analizeWithInterop(0);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(false);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(false);

  });

  test("should read true interop option as set as boolean", async () => {

    const analized = await analizeWithInterop(true);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(true);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(true);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(true);

  });

  test("should read false interop option as set as boolean", async () => {

    const analized = await analizeWithInterop(false);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(false);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(false);

  });

  test("should read truthy per-build interop option as set as boolean", async () => {

    const analized = await analizeWithBuildInterop("main", 1);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(true);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(false);

  });

  test("should read falsy per-build interop option as set as boolean", async () => {

    const analized = await analizeWithBuildInterop("browser", 0);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(true);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(true);

  });

  test("should read true per-build interop option as set as boolean", async () => {

    const analized = await analizeWithBuildInterop("bin", true);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(false);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(false);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(true);

  });

  test("should read false per-build interop option as set as boolean", async () => {

    const analized = await analizeWithBuildInterop("main", false);

    expect(analized.output.main ? analized.output.main.interop : null)
      .toBe(false);
    expect(analized.output.browser ? analized.output.browser.interop : null)
      .toBe(true);
    expect(analized.output.bin ? analized.output.bin.interop : null)
      .toBe(true);

  });

});
