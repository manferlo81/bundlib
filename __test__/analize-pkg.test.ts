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

    expect.assertions(invalidPkg.length);

    invalidPkg.forEach((pkg) => {
      expect(
        // @ts-ignore
        analize(cwd, pkg),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should read and analize package.json if not provided", async () => {

    const analized = await analize(cwd);

    expect(typeof analized)
      .toBe("object");
    expect(analized.cwd)
      .toBe(cwd);
    expect(typeof analized.pkg)
      .toBe("object");

  });

  test("should analize provided package.json", async () => {

    const pkg = { name: "lib" };
    const analized = await analize(cwd, pkg);

    expect(analized.pkg)
      .toBe(pkg);

  });

  test("should return analized package.json", async () => {

    const pkg = { name: "lib" };

    const analized = await analize(cwd, pkg);
    const {
      input,
      output,
      dependencies,
      cache,
    } = analized;

    expect(input)
      .toEqual({
        api: expect.any(String),
        bin: expect.any(String),
      });
    expect(output)
      .toEqual({
        main: null,
        module: null,
        browser: null,
        bin: null,
        types: null,
      });
    expect(dependencies)
      .toEqual({
        runtime: null,
        peer: null,
        optional: null,
      });
    expect(typeof cache)
      .toBe("string");

  });

});
