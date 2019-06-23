// @ts-check

const analize = require("./analize");

describe("analize", () => {

  const cwd = process.cwd();

  test("should throw on invalid browser field", async () => {

    const invalidBrowserPaths = [
      100,
    ];

    invalidBrowserPaths.forEach((browser) => {
      // @ts-ignore
      expect(analize(cwd, { browser })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid bundlib field", async () => {

    const invalidBundlibOptions = [
      [],
    ];

    invalidBundlibOptions.forEach((bundlib) => {
      expect(analize(cwd, { bundlib })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid input option", async () => {

    const invalidInputs = [
      100,
    ];

    invalidInputs.forEach((input) => {
      expect(analize(cwd, {
        bundlib: { input },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid browser format option", async () => {

    const invalidBrowserFormats = [
      100,
    ];

    invalidBrowserFormats.forEach((browser) => {
      expect(analize(cwd, {
        bundlib: { browser },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid name option", async () => {

    const invalidNameOptions = [
      100,
    ];

    invalidNameOptions.forEach((name) => {
      expect(analize(cwd, {
        bundlib: { name },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid id option", async () => {

    const invalidIdOptions = [
      100,
    ];

    invalidIdOptions.forEach((id) => {
      expect(analize(cwd, {
        bundlib: { id },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid globals option", async () => {

    const invalidGlobalsOptions = [
      100,
    ];

    invalidGlobalsOptions.forEach((globals) => {
      expect(analize(cwd, {
        bundlib: { globals },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid min option", async () => {

    const invalidMinOptions = [
      100,
    ];

    invalidMinOptions.forEach((min) => {
      expect(analize(cwd, {
        bundlib: { min },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should read package.json if not provided", async () => {

    const analized = await analize(cwd);

    expect(typeof analized).toBe("object");
    expect(analized.cwd).toBe(cwd);
    expect(typeof analized.pkg).toBe("object");

  });

  test("should analize provided package.json", async () => {

    const pkg = { name: "lib" };
    const analized = await analize(cwd, pkg);

    expect(analized.pkg).toBe(pkg);

  });

  test("should read dependencies and peerDependencies", async () => {

    const analized = await analize(cwd, {
      dependencies: {
        "bundelib-dep1": "1.0.0",
      },
      peerDependencies: {
        "bundelib-dep2": "1.0.0",
      },
    });

    const { runtime, peer } = analized.dependencies;

    expect(runtime).toContain("bundelib-dep1");
    expect(peer).toContain("bundelib-dep2");

  });

  test("should set types to null", async () => {

    const analized = await analize(cwd, {});

    const { types } = analized.output;
    expect(types).toBeNull();

  });

  test("should read types", async () => {

    const analized = await analize(cwd, {
      types: "types",
    });

    const { types } = analized.output;
    expect(typeof types).toBe("string");

  });

  test("should read typings", async () => {

    const analized = await analize(cwd, {
      typings: "types",
    });

    const { types } = analized.output;
    expect(typeof types).toBe("string");

  });

  test("should read types over typings", async () => {

    const inTypes = "types";

    const analized = await analize(cwd, {
      typings: "typings",
      types: inTypes,
    });

    const { types } = analized.output;
    expect(types.substr(types.length - inTypes.length)).toBe(inTypes);

  });

  test("should set browser build name", async () => {

    const name = "pkg-name";

    const analized = await analize(cwd, {
      name,
      browser: "out/lib.umd.js",
      bundlib: { name },
    });

    expect(analized.browser.name).toBe(name);

  });

  test("should default to package name if no name option provided", async () => {

    const pkgName = "pkg-name";

    const analized = await analize(cwd, {
      name: pkgName,
      browser: "out/lib.umd.js",
    });

    expect(analized.browser.name).toBe(pkgName);

  });

  test("should set browser build amd id", async () => {

    const id = "libId";

    const analized = await analize(cwd, {
      browser: "out/lib.umd.js",
      bundlib: { name: "lib", id },
    });

    expect(analized.browser.id).toBe(id);

  });

  test("should default to null if no browser build amd id provided", async () => {

    const analized = await analize(cwd, {
      browser: "out/lib.umd.js",
      bundlib: { name: "lib" },
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

    const globals = {
      module1: "mod1",
      module2: "mod2",
    };

    const analized = await analize(cwd, {
      bundlib: { globals },
    });

    expect(analized.browser.globals).toEqual(globals);

  });

  test("should set browser format to iife", async () => {

    const format = "iife";

    const analized = await analize(cwd, {
      bundlib: { browser: format },
    });

    expect(analized.browser.format).toBe(format);

  });

  test("should set browser format to amd", async () => {

    const format = "amd";

    const analized = await analize(cwd, {
      bundlib: { browser: format },
    });

    expect(analized.browser.format).toBe(format);

  });

  test("should set browser format to umd", async () => {

    const format = "umd";

    const analized = await analize(cwd, {
      bundlib: { browser: format },
    });

    expect(analized.browser.format).toBe(format);

  });

  test("should default to umd in no browser format provided", async () => {

    const analized = await analize(cwd, {});

    expect(analized.browser.format).toBe("umd");

  });

  test("should work with string min option", async () => {

    const analizeWithStringMin = (min) => analize(cwd, {
      bundlib: { min },
    });

    const analizedWithMain = await analizeWithStringMin("main");
    expect(analizedWithMain.minify.main).toBe(true);

    const analizedWithModule = await analizeWithStringMin("module");
    expect(analizedWithModule.minify.module).toBe(true);

    const analizedWithBrowser = await analizeWithStringMin("browser");
    expect(analizedWithBrowser.minify.browser).toBe(true);

  });

  test("should work with array min option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        min: ["main", "module", "browser"],
      },
    });

    expect(analized.minify.main).toBe(true);
    expect(analized.minify.module).toBe(true);
    expect(analized.minify.browser).toBe(true);

  });

  test("should work with true as min option", async () => {

    const analized = await analize(cwd, {
      bundlib: { min: true },
    });

    expect(analized.minify.main).toBe(true);
    expect(analized.minify.module).toBe(true);
    expect(analized.minify.browser).toBe(true);

  });

  test("should read sourcemap option", async () => {

    const analized = await analize(cwd, {
      bundlib: { sourcemap: false },
    });

    expect(analized.options.sourcemap).toBe(false);

  });

  test("should default to true if no sourcemap option provided", async () => {

    const analized = await analize(cwd, {});

    expect(analized.options.sourcemap).toBe(true);

  });

  test("should read esModule option as set as boolean", async () => {

    const analizeWithESModule = (esModule) => analize(cwd, {
      bundlib: { esModule },
    });

    const analizedWithTrue = await analizeWithESModule(true);
    expect(analizedWithTrue.options.esModule).toBe(true);

    const analizedWithFalse = await analizeWithESModule(false);
    expect(analizedWithFalse.options.esModule).toBe(false);

    const analizedWithTruthy = await analizeWithESModule(1);
    expect(analizedWithTruthy.options.esModule).toBe(true);

    const analizedWithFalsy = await analizeWithESModule(0);
    expect(analizedWithFalsy.options.esModule).toBe(false);

  });

  test("should read interop option as set as boolean", async () => {

    const analizeWithInterop = (interop) => analize(cwd, {
      bundlib: { interop },
    });

    const analizedWithTrue = await analizeWithInterop(true);
    expect(analizedWithTrue.options.interop).toBe(true);

    const analizedWithFalse = await analizeWithInterop(false);
    expect(analizedWithFalse.options.interop).toBe(false);

    const analizedWithTruthy = await analizeWithInterop(1);
    expect(analizedWithTruthy.options.interop).toBe(true);

    const analizedWithFalsy = await analizeWithInterop(0);
    expect(analizedWithFalsy.options.interop).toBe(false);

  });

  test("should read extend option as set as boolean", async () => {

    const analizeWithExtend = (extend) => analize(cwd, {
      bundlib: { extend },
    });

    const analizedWithTrue = await analizeWithExtend(true);
    expect(analizedWithTrue.options.extend).toBe(true);

    const analizedWithFalse = await analizeWithExtend(false);
    expect(analizedWithFalse.options.extend).toBe(false);

    const analizedWithTruthy = await analizeWithExtend(1);
    expect(analizedWithTruthy.options.extend).toBe(true);

    const analizedWithFalsy = await analizeWithExtend(0);
    expect(analizedWithFalsy.options.extend).toBe(false);

  });

  test("should read equals option as set as boolean", async () => {

    const analizeWithEquals = (equals) => analize(cwd, {
      bundlib: { equals },
    });

    const analizedWithTrue = await analizeWithEquals(true);
    expect(analizedWithTrue.options.equals).toBe(true);

    const analizedWithFalse = await analizeWithEquals(false);
    expect(analizedWithFalse.options.equals).toBe(false);

    const analizedWithTruthy = await analizeWithEquals(1);
    expect(analizedWithTruthy.options.equals).toBe(true);

    const analizedWithFalsy = await analizeWithEquals(0);
    expect(analizedWithFalsy.options.equals).toBe(false);

  });

});

