import analize from "../tools/analize";

describe("equals option", () => {

  const cwd = process.cwd();

  test("should read equals option as set as boolean", async () => {

    const analizeWithEquals = (equals: any) => analize(cwd, {
      bundlib: { equals },
    });

    const analizedWithTrue = await analizeWithEquals(true);
    expect(analizedWithTrue.options.equals).toBe(true);

    const analizedWithFalse = await analizeWithEquals(false);
    expect(analizedWithFalse.options.equals).toBe(false);

    const analizedWithTruthy = await analizeWithEquals(1);
    expect(analizedWithTruthy.options.equals).toBe(true);

    const analizedWithFalsy = await analizeWithEquals(0);
    expect(analizedWithFalsy.options.equals).toBe(false);

  });

});
