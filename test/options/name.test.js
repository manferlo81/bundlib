// @ts-check

const analize = require("../tools/analize");

describe("name option", () => {

  const cwd = process.cwd();

  test("should throw on invalid name option", () => {

    const invalidNameOptions = [
      1,
      true,
      false,
    ];

    expect.assertions(invalidNameOptions.length);

    invalidNameOptions.forEach((name) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { name },
      })).rejects.toThrow(TypeError);
    });

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

  test("should default to camelcased, unscoped package name if no name option provided", async () => {

    const pkgName = "@scope/pkg-name";

    const analized = await analize(cwd, {
      name: pkgName,
      browser: "out/lib.umd.js",
    });

    expect(analized.browser.name).toBe("pkgName");

  });

});
