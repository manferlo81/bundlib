// @ts-check

const analize = require("../tools/analize");

describe("interop option", () => {

  const cwd = process.cwd();

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

});
