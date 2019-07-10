import analize from "../tools/analize";

describe("equals option", () => {

  const cwd = process.cwd();

  const analizeWithEquals = (equals: any) => analize(cwd, {
    main: "out/lib.js",
    bundlib: { equals },
  });

  const analizeWithBuildEquals = (equals: any) => analize(cwd, {
    main: "out/lib.js",
    bundlib: { main: { equals } },
  });

  test("should read truthy equals option as set as boolean", async () => {

    const analized = await analizeWithEquals(1);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(true);

  });

  test("should read falsy equals option as set as boolean", async () => {

    const analized = await analizeWithEquals(0);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(false);

  });

  test("should read true equals option as set as boolean", async () => {

    const analized = await analizeWithEquals(true);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(true);

  });

  test("should read false equals option as set as boolean", async () => {

    const analized = await analizeWithEquals(false);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(false);

  });

  test("should read per build truthy equals option as set as boolean", async () => {

    const analized = await analizeWithBuildEquals(1);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(true);

  });

  test("should read per build falsy equals option as set as boolean", async () => {

    const analized = await analizeWithBuildEquals(0);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(false);

  });

  test("should read per build true equals option as set as boolean", async () => {

    const analized = await analizeWithBuildEquals(true);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(true);

  });

  test("should read per build false equals option as set as boolean", async () => {

    const analized = await analizeWithBuildEquals(false);

    expect(analized.output.main ? analized.output.main.equals : null)
      .toBe(false);

  });

});
