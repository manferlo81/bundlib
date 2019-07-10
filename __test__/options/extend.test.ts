import analize from "../tools/analize";

describe("extend option", () => {

  const cwd = process.cwd();

  const analizeWithExtend = (extend: any) => analize(cwd, {
    browser: "out/lib.js",
    bundlib: { extend },
  });

  test("should read truthy extend option as set as boolean", async () => {

    const analized = await analizeWithExtend(1);

    expect(analized.output.browser ? analized.output.browser.extend : null)
      .toBe(true);

  });

  test("should read falsy extend option as set as boolean", async () => {

    const analized = await analizeWithExtend(0);

    expect(analized.output.browser ? analized.output.browser.extend : null)
      .toBe(false);

  });

  test("should read true extend option as set as boolean", async () => {

    const analized = await analizeWithExtend(true);

    expect(analized.output.browser ? analized.output.browser.extend : null)
      .toBe(true);

  });

  test("should read false extend option as set as boolean", async () => {

    const analized = await analizeWithExtend(false);

    expect(analized.output.browser ? analized.output.browser.extend : null)
      .toBe(false);

  });

});
