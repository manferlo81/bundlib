const { analizePkg, pkgToConfigs } = require("../..");

const cwd = process.cwd();

describe("package to configs", () => {

  test("should generate empty array", async () => {

    const pkg = await analizePkg(cwd, {});

    const configs = pkgToConfigs(
      pkg,
      false,
    );

    expect(configs).toHaveLength(0);

  });

  test("should generate CommonJS and ES modules config", async () => {

    const pkg = await analizePkg(cwd, {
      main: "out/lib.cjs.js",
      module: "out/lib.es.js",
    });

    const configs = pkgToConfigs(
      pkg,
      true,
    );

    expect(configs).toHaveLength(2);

    const [cjsConfig, esConfig] = configs;

    expect(typeof cjsConfig).toBe("object");
    expect(typeof cjsConfig.output).toBe("object");
    expect(cjsConfig.output.format).toBe("cjs");

    expect(typeof esConfig).toBe("object");
    expect(typeof esConfig.output).toBe("object");
    expect(esConfig.output.format).toBe("es");

  });

  test("should generate IIFE and AMD modules config", async () => {

    const pkg = await analizePkg(cwd, {
      bundlib: {
        name: "lib",
        id: "lib",
        iife: "out/lib.iife.js",
        amd: "out/lib.amd.js",
        globals: {},
      },
    });

    const configs = pkgToConfigs(
      pkg,
      true,
    );

    expect(configs).toHaveLength(2);

    const [iifeConfig, amdConfig] = configs;

    expect(typeof iifeConfig).toBe("object");
    expect(typeof iifeConfig.output).toBe("object");
    expect(iifeConfig.output.format).toBe("iife");

    expect(typeof amdConfig).toBe("object");
    expect(typeof amdConfig.output).toBe("object");
    expect(amdConfig.output.format).toBe("amd");
    expect(typeof amdConfig.output.amd).toBe("object");
    expect(amdConfig.output.amd.id).toBe("lib");

  });

  test("should generate UMD module config", async () => {

    const pkg = await analizePkg(cwd, {
      bundlib: {
        name: "lib",
        id: "lib",
        umd: "out/lib.umd.js",
      },
    });

    const configs = pkgToConfigs(
      pkg,
      true,
    );

    expect(configs).toHaveLength(1);

    const [umdConfig] = configs;

    expect(typeof umdConfig).toBe("object");
    expect(typeof umdConfig.output).toBe("object");
    expect(umdConfig.output.format).toBe("umd");
    expect(typeof umdConfig.output.amd).toBe("object");
    expect(umdConfig.output.amd.id).toBe("lib");

  });


});
