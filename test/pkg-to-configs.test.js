// @ts-check

const createConfigs = require("./tools/create-configs");

describe("package to configs", () => {

  const cwd = process.cwd();

  test("should throw if name required and not provided", () => {

    return expect(createConfigs("", false, {
      browser: "out/lib.js",
    })).rejects.toThrow();

  });

  test("should generate empty array", async () => {

    const configs = await createConfigs(cwd, false, {});

    expect(configs).toHaveLength(0);

  });

  test("should generate ES module config", async () => {

    const configs = await createConfigs(cwd, true, {
      module: "out/lib.cjs.js",
    });

    expect(configs).toHaveLength(1);
    const [esConfig] = configs;
    expect(esConfig.output.format).toBe("es");

  });

  test("should generate CommonJS module config", async () => {

    const configs = await createConfigs(cwd, true, {
      main: "out/lib.cjs.js",
    });

    expect(configs).toHaveLength(1);
    const [cjsConfig] = configs;
    expect(cjsConfig.output.format).toBe("cjs");

  });

  test("should generate IIFE build config", async () => {

    const format = "iife";
    const name = "libName";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.iife.js",
      bundlib: { browser: format, name, globals: {} },
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const { output } = config;

    expect(output.format).toBe(format);
    expect(output.name).toBe(name);

  });

  test("should generate AMD build config", async () => {

    const format = "amd";
    const name = "libName";
    const id = "lib-id";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.js",
      bundlib: { browser: format, name, id, globals: {} },
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const { output } = config;

    expect(output.format).toBe(format);
    expect(output.name).toBe(name);
    expect(output.amd.id).toBe(id);

  });

  test("should generate UMD build config", async () => {

    const format = "umd";
    const name = "libName";
    const id = "lib-id";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.js",
      bundlib: { browser: format, name, id, globals: {} },
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const { output } = config;

    expect(output.format).toBe(format);
    expect(output.name).toBe(name);
    expect(output.amd.id).toBe(id);

  });

  test("should generate UMD build if not format provided", async () => {

    const name = "libName";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.js",
      bundlib: { name },
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const { output } = config;

    expect(typeof output).toBe("object");
    expect(output.format).toBe("umd");
    expect(output.name).toBe(name);

  });

  test("should generate Bynary build config", async () => {

    const configs = await createConfigs(cwd, true, {
      bin: "out/lib.js",
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const { output } = config;

    expect(typeof output).toBe("object");
    expect(output.format).toBe("cjs");

  });

  test("should add exportEquals plugin if conditions apply", async () => {

    const configs = await createConfigs(cwd, true, {
      main: "out/lib.js",
      types: "out/lib.d.ts",
      bundlib: {
        equals: true,
      },
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const pluginNames = config.plugins.map((plugin) => plugin.name);

    expect(pluginNames).toContain("export-equals");

  });

  test("should add shebang plugins if conditions apply", async () => {

    const configs = await createConfigs(cwd, true, {
      bin: "bin/cli.js",
    });

    expect(configs).toHaveLength(1);

    const [config] = configs;
    const pluginNames = config.plugins.map((plugin) => plugin.name);

    expect(pluginNames).toContain("strip-shebang");
    expect(pluginNames).toContain("shebang");

  });

  test("should generate configs with extra minified versions", async () => {

    const minifiedPostfix = ".min.js";

    const configs = await createConfigs(cwd, false, {
      main: "out/lib.cjs.js",
      module: "out/lib.es.js",
      browser: "out/lib.umd.js",
      bundlib: {
        name: "lib",
        min: ["main", "module", "browser"],
      },
    });

    expect(configs).toHaveLength(6);

    configs.forEach((config, index) => {

      const isMin = index % 2;

      if (isMin) {

        const { file } = config.output;
        expect(file.substr(file.length - minifiedPostfix.length)).toBe(minifiedPostfix);

      }

    });

  });

});
