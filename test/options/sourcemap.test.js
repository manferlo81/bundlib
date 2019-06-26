// @ts-check

const analize = require("../tools/analize");

describe("sourcemap option", () => {

  const cwd = process.cwd();

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

});
