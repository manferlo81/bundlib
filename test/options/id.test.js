// @ts-check

const analize = require("../tools/analize");

describe("id option", () => {

  const cwd = process.cwd();

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

});
