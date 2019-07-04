import analize from "./tools/analize";

describe("analize", () => {

  const cwd = process.cwd();

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
    const {
      input,
      output,
      sourcemap,
      dependencies,
      browser,
      minify,
      options,
      cache,
    } = await analize(cwd, pkg);

    expect(input).toEqual({
      api: expect.any(String),
      bin: expect.any(String),
    });
    expect(output).toEqual({
      main: null,
      module: null,
      browser: null,
      bin: null,
      types: null,
    });
    expect(sourcemap).toBe(true);
    expect(dependencies).toEqual({
      runtime: null,
      peer: null,
      optional: null,
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
    expect(typeof cache).toBe("string");

  });

});
