const { analizePkg, pkgToConfigs } = require("..");

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

    const [config, config2] = configs;

    expect(typeof config).toBe("object");
    expect(typeof config.output).toBe("object");
    expect(config.output.format).toBe("cjs");

    expect(typeof config2).toBe("object");
    expect(typeof config2.output).toBe("object");
    expect(config2.output.format).toBe("es");

  });

  test("should generate IIFE, AMD and UMD modules config", async () => {

    const pkg = await analizePkg(cwd, {
      bundlib: {
        name: "lib",
        id: "lib",
        iife: "out/lib.iife.js",
        amd: "out/lib.amd.js",
        umd: "out/lib.umd.js",
        globals: {},
      },
    });

    const configs = pkgToConfigs(
      pkg,
      true,
    );

    expect(configs).toHaveLength(3);

    const [config, config2, config3] = configs;

    expect(typeof config).toBe("object");
    expect(typeof config.output).toBe("object");
    expect(config.output.format).toBe("iife");

    expect(typeof config2).toBe("object");
    expect(typeof config2.output).toBe("object");
    expect(config2.output.format).toBe("amd");
    expect(typeof config2.output.amd).toBe("object");
    expect(config2.output.amd.id).toBe("lib");

    expect(typeof config3).toBe("object");
    expect(typeof config3.output).toBe("object");
    expect(config3.output.format).toBe("umd");
    expect(typeof config3.output.amd).toBe("object");
    expect(config3.output.amd.id).toBe("lib");

  });


});
