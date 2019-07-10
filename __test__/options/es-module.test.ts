import analize from "../tools/analize";

describe("esModule option", () => {

  const cwd = process.cwd();

  test("should read esModule option as set as boolean", async () => {

    const analizeWithESModule = (esModule?: any) => analize(cwd, {
      main: "out/lib.cjs.js",
      browser: "out/lib.umd.js",
      bundlib: { esModule },
    });

    const analizedWithTrue = await analizeWithESModule(true);
    expect(analizedWithTrue.output.main ? analizedWithTrue.output.main.esModule : null).toBe(true);
    expect(analizedWithTrue.output.browser ? analizedWithTrue.output.browser.esModule : null).toBe(true);

    const analizedWithFalse = await analizeWithESModule(false);
    expect(analizedWithFalse.output.main ? analizedWithFalse.output.main.esModule : null).toBe(false);
    expect(analizedWithFalse.output.browser ? analizedWithFalse.output.browser.esModule : null).toBe(false);

    const analizedWithTruthy = await analizeWithESModule(1);
    expect(analizedWithTruthy.output.main ? analizedWithTruthy.output.main.esModule : null).toBe(true);
    expect(analizedWithTruthy.output.browser ? analizedWithTruthy.output.browser.esModule : null).toBe(true);

    const analizedWithFalsy = await analizeWithESModule(0);
    expect(analizedWithFalsy.output.main ? analizedWithFalsy.output.main.esModule : null).toBe(false);
    expect(analizedWithFalsy.output.browser ? analizedWithFalsy.output.browser.esModule : null).toBe(false);

  });

});
