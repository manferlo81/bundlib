const createConfigs = require("../test-helpers/create-configs");

describe("package to configs", () => {

  const cwd = process.cwd();

  test("should generate empty array", async () => {

    const configs = await createConfigs(cwd, false, {});

    expect(configs).toHaveLength(0);

  });

  test("should throw if name required and not provided", () => {

    expect(createConfigs(cwd, false, {
      browser: "out/lib.js",
    })).rejects.toThrow();

  });

  test("should generate CommonJS and ES modules config", async () => {

    const configs = await createConfigs(cwd, true, {
      main: "out/lib.cjs.js",
      module: "out/lib.es.js",
    });

    expect(configs).toHaveLength(2);

    const [esConfig, cjsConfig] = configs;

    expect(typeof cjsConfig).toBe("object");
    expect(typeof cjsConfig.output).toBe("object");
    expect(cjsConfig.output.format).toBe("cjs");

    expect(typeof esConfig).toBe("object");
    expect(typeof esConfig.output).toBe("object");
    expect(esConfig.output.format).toBe("es");

  });

  test("should generate IIFE build config", async () => {

    const format = "iife";
    const name = "libName";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.iife.js",
      bundlib: {
        browser: format,
        name,
        globals: {},
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;

    expect(typeof config).toBe("object");
    const { output } = config;

    expect(typeof output).toBe("object");
    expect(output.format).toBe(format);
    expect(output.name).toBe(name);

  });

  test("should generate AMD build config", async () => {

    const format = "amd";
    const name = "libName";
    const id = "lib-id";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.js",
      bundlib: {
        browser: format,
        name,
        id,
        globals: {},
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;

    expect(typeof config).toBe("object");
    const { output } = config;

    expect(typeof output).toBe("object");
    expect(output.format).toBe(format);
    expect(output.name).toBe(name);

    expect(typeof output.amd).toBe("object");
    expect(output.amd.id).toBe(id);

  });

  test("should generate UMD build config", async () => {

    const format = "umd";
    const name = "libName";
    const id = "lib-id";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.js",
      bundlib: {
        browser: format,
        name,
        id,
        globals: {},
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;

    expect(typeof config).toBe("object");
    const { output } = config;

    expect(typeof output).toBe("object");
    expect(output.format).toBe(format);
    expect(output.name).toBe(name);

    expect(typeof output.amd).toBe("object");
    expect(output.amd.id).toBe(id);

  });

  test("should generate UMD build if not format provided", async () => {

    const name = "libName";

    const configs = await createConfigs(cwd, true, {
      browser: "out/lib.js",
      bundlib: {
        name,
        globals: {},
      },
    });

    expect(configs).toHaveLength(1);
    const [config] = configs;

    expect(typeof config).toBe("object");
    const { output } = config;

    expect(typeof output).toBe("object");
    expect(output.format).toBe("umd");
    expect(output.name).toBe(name);

  });

  test("should generate CommonJS module config with extra minified version", async () => {

    const minifiedName = "lib.cjs.min.js";

    const configs = await createConfigs(cwd, true, {
      main: "out/lib.cjs.js",
      bundlib: {
        min: "main",
      },
    });

    expect(configs).toHaveLength(2);

    const [cjsConfig, cjsMinConfig] = configs;

    expect(typeof cjsConfig).toBe("object");
    expect(typeof cjsConfig.output).toBe("object");
    expect(cjsConfig.output.format).toBe("cjs");

    expect(typeof cjsMinConfig).toBe("object");
    expect(typeof cjsMinConfig.output).toBe("object");
    expect(cjsMinConfig.output.format).toBe("cjs");
    const { file } = cjsMinConfig.output;
    expect(file.substr(file.length - minifiedName.length)).toBe(minifiedName);

  });


  // test("should generate UMD module config", async () => {

  //   const configs = await createConfigs(cwd, true, {
  //     bundlib: {
  //       name: "lib",
  //       id: "lib",
  //       umd: "out/lib.umd.js",
  //     },
  //   });

  //   expect(configs).toHaveLength(1);

  //   const [umdConfig] = configs;

  //   expect(typeof umdConfig).toBe("object");
  //   expect(typeof umdConfig.output).toBe("object");
  //   expect(umdConfig.output.format).toBe("umd");
  //   expect(typeof umdConfig.output.amd).toBe("object");
  //   expect(umdConfig.output.amd.id).toBe("lib");

  // });


});
