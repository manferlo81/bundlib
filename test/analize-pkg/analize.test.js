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

  test("should throw on invalid browser format option", async () => {

    expect(analize(cwd, {
      bundlib: {
        browser: 100,
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

  test("should throw on invalid globals option", async () => {

    expect(analize(cwd, {
      bundlib: {
        globals: 100,
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

  test("should read types over typings", async () => {

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

  test("should set browser build name", async () => {

    const name = "pkg-name";

    const analized = await analize(cwd, {
      name: name,
      browser: "out/lib.umd.js",
      bundlib: {
        name,
      },
    });

    expect(analized.browser.name).toBe(name);

  });

  test("should default to package name if no name option provided", async () => {

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

  test("should set browser build amd id", async () => {

    const id = "libId";

    const analized = await analize(cwd, {
      browser: "out/lib.umd.js",
      bundlib: {
        name: "lib",
        id,
      },
    });

    expect(analized.browser.id).toBe(id);

  });

  test("should default to null if no browser build amd id provided", async () => {

    const analized = await analize(cwd, {
      browser: "out/lib.umd.js",
      bundlib: {
        name: "lib",
      },
    });

    expect(analized.browser.id).toBeNull();

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

  test("should set browser format to iife", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        browser: "iife",
      },
    });

    expect(analized.browser.format).toBe("iife");

  });

  test("should set browser format to amd", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        browser: "amd",
      },
    });

    expect(analized.browser.format).toBe("amd");

  });

  test("should set browser format to umd", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        browser: "umd",
      },
    });

    expect(analized.browser.format).toBe("umd");

  });

  test("should default to umd in no browser format provided", async () => {

    const analized = await analize(cwd, {});

    expect(analized.browser.format).toBe("umd");

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

  // Deprecated

  test("should throw on multiple browser build", () => {

    expect(analize(cwd, {
      bundlib: {
        iife: "out/lib.iife.js",
        amd: "out/lib.amd.js",
      },
    })).rejects.toThrow();

    expect(analize(cwd, {
      bundlib: {
        iife: "out/lib.iife.js",
        umd: "out/lib.umd.js",
      },
    })).rejects.toThrow();

    expect(analize(cwd, {
      bundlib: {
        amd: "out/lib.amd.js",
        umd: "out/lib.umd.js",
      },
    })).rejects.toThrow();

  });

  test("should use deprecated iife option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        iife: "out/lib.js",
      },
    });

    expect(analized.browser.format).toBe("iife");

  });

  test("should use deprecated amd option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        amd: "out/lib.js",
      },
    });

    expect(analized.browser.format).toBe("amd");

  });

});

