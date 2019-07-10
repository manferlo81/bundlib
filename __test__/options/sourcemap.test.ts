import analize from "../tools/analize";

describe("sourcemap option", () => {

  const cwd = process.cwd();

  const analizedWithSourcemap = (sourcemap: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    module: "out/lib.es.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { sourcemap },
  });

  const analizedWithBuildSourcemap = (field: any, sourcemap: any) => analize(cwd, {
    main: "out/lib.cjs.js",
    module: "out/lib.es.js",
    browser: "out/lib.umd.js",
    bin: "out/lib.bin.js",
    bundlib: { [field]: { sourcemap } },
  });

  test("should throw on invalid sourcemap option", () => {

    const invalidSoucemaps = [
      100,
      "string",
      {},
      [],
    ];

    expect.assertions(invalidSoucemaps.length);

    invalidSoucemaps.forEach((sourcemap) => {
      expect(
        analizedWithSourcemap(sourcemap),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should read sourcemap option", async () => {

    const analized = await analizedWithSourcemap(false);

    expect(analized.output.main ? analized.output.main.sourcemap : null).toBe(false);
    expect(analized.output.module ? analized.output.module.sourcemap : null).toBe(false);
    expect(analized.output.browser ? analized.output.browser.sourcemap : null).toBe(false);
    expect(analized.output.bin ? analized.output.bin.sourcemap : null).toBe(false);

  });

  test("should read inline sourcemap option", async () => {

    const analized = await analizedWithSourcemap("inline");

    expect(analized.output.main ? analized.output.main.sourcemap : null).toBe("inline");
    expect(analized.output.module ? analized.output.module.sourcemap : null).toBe("inline");
    expect(analized.output.browser ? analized.output.browser.sourcemap : null).toBe("inline");
    expect(analized.output.bin ? analized.output.bin.sourcemap : null).toBe("inline");

  });

  test("should read build sourcemap option", async () => {

    const analized = await analizedWithBuildSourcemap("main", false);

    expect(analized.output.main ? analized.output.main.sourcemap : null).toBe(false);
    expect(analized.output.module ? analized.output.module.sourcemap : null).toBe(true);
    expect(analized.output.browser ? analized.output.browser.sourcemap : null).toBe(true);
    expect(analized.output.bin ? analized.output.bin.sourcemap : null).toBe(true);

  });

  test("should read build inline sourcemap option", async () => {

    const analized = await analizedWithBuildSourcemap("module", "inline");

    expect(analized.output.main ? analized.output.main.sourcemap : null).toBe(true);
    expect(analized.output.module ? analized.output.module.sourcemap : null).toBe("inline");
    expect(analized.output.browser ? analized.output.browser.sourcemap : null).toBe(true);
    expect(analized.output.bin ? analized.output.bin.sourcemap : null).toBe(true);

  });

  test("should default to true if no sourcemap option provided", async () => {

    const analized = await analize(cwd, {
      main: "out/lib.cjs.js",
      module: "out/lib.es.js",
      browser: "out/lib.umd.js",
      bin: "out/lib.bin.js",
    });

    expect(analized.output.main ? analized.output.main.sourcemap : null).toBe(true);
    expect(analized.output.module ? analized.output.module.sourcemap : null).toBe(true);
    expect(analized.output.browser ? analized.output.browser.sourcemap : null).toBe(true);
    expect(analized.output.bin ? analized.output.bin.sourcemap : null).toBe(true);

  });

});
