// @ts-check

const { join: pathJoin } = require("path");
const analize = require("./analize");

describe("analize", () => {

  const cwd = process.cwd();

  test("should throw on no package.json", () => {

    expect(analize(pathJoin(cwd, "dist"))).rejects.toThrow();

  });

  test("should throw on invalid folder", () => {

    expect(analize(pathJoin(cwd, "does-not-exist"))).rejects.toThrow();

  });

  test("should throw on invalid package.json", () => {

    const invalidPkg = [
      1,
      "string",
      [],
      true,
    ];

    invalidPkg.forEach((pkg) => {
      // @ts-ignore
      expect(analize(cwd, pkg)).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid browser field", () => {

    const invalidBrowserPaths = [
      1,
      { "name": "value" },
    ];

    invalidBrowserPaths.forEach((browser) => {
      // @ts-ignore
      expect(analize(cwd, { browser })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid bundlib field", () => {

    const invalidBundlibOptions = [
      1,
      [],
    ];

    invalidBundlibOptions.forEach((bundlib) => {
      // @ts-ignore
      expect(analize(cwd, { bundlib })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid input option", () => {

    const invalidInputs = [
      1,
      true,
      false,
    ];

    invalidInputs.forEach((input) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { input },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid sourcemap option", () => {

    const invalidInputs = [
      100,
      "string",
      {},
      [],
    ];

    invalidInputs.forEach((sourcemap) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { sourcemap },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid browser format option", () => {

    const invalidBrowserFormats = [
      1,
      "string",
    ];

    invalidBrowserFormats.forEach((browser) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { browser },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid name option", () => {

    const invalidNameOptions = [
      1,
      true,
      false,
    ];

    invalidNameOptions.forEach((name) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { name },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid id option", () => {

    const invalidIdOptions = [
      1,
      true,
      false,
    ];

    invalidIdOptions.forEach((id) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { id },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid globals option", () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ];

    invalidGlobalsOptions.forEach((globals) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { globals },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on invalid min option", () => {

    const invalidMinOptions = [
      1,
      "string",
      ["string"],
    ];

    invalidMinOptions.forEach((min) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { min },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on unknown option", () => {

    const invalidOptions = [
      "iife",
      "amd",
      "umd",
      "option1",
      "option2",
    ];

    invalidOptions.forEach((option) => {
      expect(analize(cwd, {
        bundlib: { [option]: true },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should throw on non typescript input option", async () => {

    expect(analize(cwd, {
      bundlib: { input: "index.js" },
    })).rejects.toThrow(TypeError);

  });

  test("should read and analize package.json if not provided", async () => {

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

  test("should return analized package.json", async () => {

    const pkg = { name: "lib" };
    const { input, output, sourcemap, dependencies, browser, minify, options } = await analize(cwd, pkg);

    expect(input).toEqual(expect.any(String));
    expect(output).toEqual({
      main: null,
      module: null,
      browser: null,
      types: null,
    });
    expect(sourcemap).toBe(true);
    expect(dependencies).toEqual({
      runtime: expect.any(Array),
      peer: expect.any(Array),
    });
    expect(browser).toEqual({
      format: "umd",
      name: "lib",
      id: null,
      globals: null,
    });
    expect(minify).toEqual({
      main: false,
      module: false,
      browser: false,
    });
    expect(options).toEqual({
      extend: false,
      esModule: false,
      interop: false,
      equals: false,
    });

  });


  test("should read input option", async () => {

    const analized = await analize(cwd, {
      bundlib: { input: "src/main.ts" },
    });

    expect(analized.input).toMatch(/main\.ts$/);

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

  test("should set types to null if no type path provided", async () => {

    const analized = await analize(cwd, {});

    const { types } = analized.output;
    expect(types).toBeNull();

  });

  test("should read types", async () => {

    const analized = await analize(cwd, {
      types: "types/index.d.ts",
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
    expect(types).toMatch(new RegExp(`${inTypes}$`));

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
    expect(analizedWithMain.minify).toEqual({
      main: true,
      module: false,
      browser: false,
    });

    const analizedWithModule = await analizeWithStringMin("module");
    expect(analizedWithModule.minify).toEqual({
      main: false,
      module: true,
      browser: false,
    });

    const analizedWithBrowser = await analizeWithStringMin("browser");
    expect(analizedWithBrowser.minify).toEqual({
      main: false,
      module: false,
      browser: true,
    });

  });

  test("should work with array min option", async () => {

    const analized = await analize(cwd, {
      bundlib: {
        min: ["main", "module", "browser"],
      },
    });

    expect(analized.minify).toEqual({
      main: true,
      module: true,
      browser: true,
    });

  });

  test("should work with true as min option", async () => {

    const analized = await analize(cwd, {
      bundlib: { min: true },
    });

    expect(analized.minify).toEqual({
      main: true,
      module: true,
      browser: true,
    });

  });

  test("should read sourcemap option", async () => {

    const analized = await analize(cwd, {
      bundlib: { sourcemap: false },
    });

    expect(analized.sourcemap).toBe(false);

  });

  test("should read inline sourcemap option", async () => {

    const analized = await analize(cwd, {
      bundlib: { sourcemap: "inline" },
    });

    expect(analized.sourcemap).toBe("inline");

  });

  test("should default to true if no sourcemap option provided", async () => {

    const analized = await analize(cwd, {});

    expect(analized.sourcemap).toBe(true);

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

