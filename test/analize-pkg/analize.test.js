const analize = require("../test-helpers/analize");

describe("analize", () => {

  const cwd = process.cwd();

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

    const typings = "typings";

    const analized = await analize(cwd, {
      types: "types",
      typings,
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("output");

    const { output } = analized;
    expect(output).toHaveProperty("types");

    const { types } = output;
    expect(typeof types).toBe("string");

    expect(types.substr(types.length - typings.length)).toBe(typings);

  });

  test("build name should default to package name", async () => {

    const pkgName = "pkg-name";

    const analized = await analize(cwd, {
      name: pkgName,
      bundlib: {
        iife: "out/lib.iife.js",
        amd: "out/lib.amd.js",
        umd: "out/lib.umd.js",
      },
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("options");

    const { options } = analized;
    expect(options).toHaveProperty("name");

    const { name } = options;
    expect(name).toBe(pkgName);

  });

});
