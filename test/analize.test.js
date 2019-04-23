const { analizePkg } = require("..");

const cwd = process.cwd();

const analize = (options) => options ? analizePkg(cwd, options) : analizePkg(cwd);

describe("analize", () => {

  test("should read package.json if not provided", async () => {

    const analized = await analize();

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("pkg");
    expect(typeof analized.pkg).toBe("object");

  });

  test("should add dependencies and peerDependencies to external", async () => {

    const analized = await analize({
      dependencies: {
        "bundelib-dep1": "1.0.0",
      },
      peerDependencies: {
        "bundelib-dep2": "1.0.0",
      },
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("external");

    const { external } = analized;

    expect(external).toContain("bundelib-dep1");
    expect(external).toContain("bundelib-dep2");

  });

  test("should set types to null", async () => {

    const analized = await analize({});

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("types");

    const { types } = analized;

    expect(types).toBeNull();

  });

  test("should read types", async () => {

    const analized = await analize({
      types: "types",
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("types");

    const { types } = analized;

    expect(typeof types).toBe("string");

  });

  test("should read typings", async () => {

    const analized = await analize({
      typings: "types",
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("types");

    const { types } = analized;

    expect(typeof types).toBe("string");

  });

  test("should types filename default to index.d.ts", async () => {

    const folder = "types";
    const index = "index.d.ts";

    const analized = await analize({
      types: folder,
    });

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("types");

    const { types } = analized;

    expect(typeof types).toBe("string");
    expect(types.substr(types.length - index.length, index.length)).toBe(index);

  });

  test("should throw error if not name present", async () => {

    await expect(
      analize({
        bundlib: {
          iife: "out/lib.iife.js",
          amd: "out/lib.amd.js",
          umd: "out/lib.umd.js",
        },
      })
    ).rejects.toThrow();

  });



  // test("should analize package.json", async () => {

  //   const json = {
  //     main: "test/output.js",
  //     peerDependencies: {},
  //     types: "index.d.ts",
  //   };

  //   const analized = await analize(json);

  //   expect(typeof analized).toBe("object");
  //   expect(analized).toHaveProperty("cwd");
  //   expect(analized).toHaveProperty("pkg");
  //   expect(analized).toHaveProperty("external");
  //   expect(analized).toHaveProperty("types");
  //   expect(analized).toHaveProperty("options");

  //   const { cwd: analizedCWD, pkg, external, types, options } = analized;

  //   expect(analizedCWD).toBe(cwd);
  //   expect(pkg).toBe(json);
  //   expect(external).toHaveProperty("length");
  //   expect(typeof types).toBe("string");
  //   expect(typeof options).toBe("object");
  //   expect(options).toHaveProperty("input");
  //   expect(options).toHaveProperty("sourcemap");
  //   expect(options).toHaveProperty("esModule");
  //   expect(options).toHaveProperty("interop");

  // });

});
