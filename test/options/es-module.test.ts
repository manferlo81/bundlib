import analize from "../tools/analize";

describe("esModule option", () => {

  const cwd = process.cwd();

  test("should read esModule option as set as boolean", async () => {

    const analizeWithESModule = (esModule?: any) => analize(cwd, {
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

});
