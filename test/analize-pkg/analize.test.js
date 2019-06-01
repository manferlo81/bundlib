const analize = require("../test-helpers/analize");

describe("analize", () => {

  const cwd = process.cwd();

  test("should throw on invalid browser field", async () => {

    expect(analize(cwd, {
      browser: 100,
    })).rejects.toThrow(TypeError);

  });

  test("should throw on invalid bundlib field", async () => {

    expect(analize(cwd, {
      bundlib: [],
    })).rejects.toThrow(TypeError);

  });

  test("should throw on invalid input option", async () => {

    expect(analize(cwd, {
      bundlib: {
        input: 100,
      },
    })).rejects.toThrow(TypeError);

  });

  test("should throw on invalid browser option", async () => {

    expect(analize(cwd, {
      bundlib: {
        browser: 100,
      },
    })).rejects.toThrow(TypeError);

  });

  test("should throw on invalid name option", async () => {

    expect(analize(cwd, {
      bundlib: {
        name: 100,
      },
    })).rejects.toThrow(TypeError);

  });

  test("should throw on invalid id option", async () => {

    expect(analize(cwd, {
      bundlib: {
        id: 100,
      },
    })).rejects.toThrow(TypeError);

  });

  test("should throw on invalid min option", async () => {

    expect(analize(cwd, {
      bundlib: {
        min: 100,
      },
    })).rejects.toThrow(TypeError);

  });

  test("should work with string min option", () => {

    ["main", "module", "browser"].forEach(async (min) => {

      const analized = await analize(cwd, {
        bundlib: {
          min,
        },
      });

      expect(analized).toHaveProperty("minify");
      expect(analized.minify).toHaveProperty(min);
      expect(analized.minify[min]).toBe(true);

    });


  });

  test("should work with array min option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        min: ["main", "module", "browser"],
      },
    });

    expect(analized).toHaveProperty("minify");

    expect(analized.minify).toHaveProperty("main");
    expect(analized.minify.main).toBe(true);

    expect(analized.minify).toHaveProperty("module");
    expect(analized.minify.module).toBe(true);

    expect(analized.minify).toHaveProperty("browser");
    expect(analized.minify.browser).toBe(true);

  });

  test("should work with true as min option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        min: true,
      },
    });

    expect(analized).toHaveProperty("minify");

    expect(analized.minify).toHaveProperty("main");
    expect(analized.minify.main).toBe(true);

    expect(analized.minify).toHaveProperty("module");
    expect(analized.minify.module).toBe(true);

    expect(analized.minify).toHaveProperty("browser");
    expect(analized.minify.browser).toBe(true);

  });

  test("should throw on invalid globals option", async () => {

    expect(analize(cwd, {
      bundlib: {
        globals: 100,
      },
    })).rejects.toThrow(TypeError);

  });

  test("should work with array globals option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        globals: ["module1", "module2"],
      },
    });

    expect(analized.browser.globals).toEqual({
      module1: "module1",
      module2: "module2",
    });

  });

  test("should work with object globals option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        globals: {
          module1: "module1",
          module2: "module2",
        },
      },
    });

    expect(analized.browser.globals).toEqual({
      module1: "module1",
      module2: "module2",
    });

  });

  test("should read package.json if not provided", async () => {

    const analized = await analize(cwd);

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("pkg");
    expect(typeof analized.pkg).toBe("object");

  });

  test("should add dependencies and peerDependencies to external", async () => {

    const analized = await analize(cwd, {
      dependencies: {
        "bundelib-dep1": "1.0.0",
      },
      peerDependencies: {
        "bundelib-dep2": "1.0.0",
      },
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("dependencies");

    const { dependencies } = analized;

    expect(dependencies).toHaveProperty("runtime");
    expect(dependencies).toHaveProperty("peer");

    const { runtime, peer } = dependencies;

    expect(runtime).toContain("bundelib-dep1");
    expect(peer).toContain("bundelib-dep2");

  });

  test("should set types to null", async () => {

    const analized = await analize(cwd, {});

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("output");

    const { output } = analized;
    expect(output).toHaveProperty("types");

    const { types } = output;
    expect(types).toBeNull();

  });

  test("should read types", async () => {

    const analized = await analize(cwd, {
      types: "types",
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("output");

    const { output } = analized;
    expect(output).toHaveProperty("types");

    const { types } = output;
    expect(typeof types).toBe("string");

  });

  test("should read typings", async () => {

    const analized = await analize(cwd, {
      typings: "types",
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("output");

    const { output } = analized;
    expect(output).toHaveProperty("types");

    const { types } = output;
    expect(typeof types).toBe("string");

  });

  test("should read typings over types", async () => {

    const inTypes = "types";

    const analized = await analize(cwd, {
      typings: "typings",
      types: inTypes,
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("output");

    const { output } = analized;
    expect(output).toHaveProperty("types");

    const { types } = output;
    expect(typeof types).toBe("string");

    expect(types.substr(types.length - inTypes.length)).toBe(inTypes);

  });

  test("build name should default to package name", async () => {

    const pkgName = "pkg-name";

    const analized = await analize(cwd, {
      name: pkgName,
      browser: "out/lib.umd.js",
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("browser");

    const { browser } = analized;
    expect(browser).toHaveProperty("name");

    const { name } = browser;
    expect(name).toBe(pkgName);

  });

});
