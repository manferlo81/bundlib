import analize from "../tools/analize";

describe("extend option", () => {

  const cwd = process.cwd();

  test("should read extend option as set as boolean", async () => {

    const analizeWithExtend = (extend: any) => analize(cwd, {
      bundlib: { extend },
    });

    const analizedWithTrue = await analizeWithExtend(true);
    expect(analizedWithTrue.options.extend).toBe(true);

    const analizedWithFalse = await analizeWithExtend(false);
    expect(analizedWithFalse.options.extend).toBe(false);

    const analizedWithTruthy = await analizeWithExtend(1);
    expect(analizedWithTruthy.options.extend).toBe(true);

    const analizedWithFalsy = await analizeWithExtend(0);
    expect(analizedWithFalsy.options.extend).toBe(false);

  });

});
