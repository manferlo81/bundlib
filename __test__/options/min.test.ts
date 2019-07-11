import { MinifiableFields } from "../../src/api/pkg-analized";
import analize from "../tools/analize";

describe("min option", () => {

  const cwd = process.cwd();

  const analizeWithMin = (min: any) => analize(cwd, {
    main: "lib.js",
    module: "lib.js",
    browser: "lib.js",
    bin: "lib.js",
    bundlib: { min },
  });

  const analizeWithBuildMin = (min: any, field: MinifiableFields) => analize(cwd, {
    main: "lib.js",
    module: "lib.js",
    browser: "lib.js",
    bin: "lib.js",
    bundlib: { [field]: { min } },
  });

  test("should throw on invalid min option", () => {

    const invalidMinOptions = [
      1,
      "string",
      ["string"],
    ];

    expect.assertions(invalidMinOptions.length);

    invalidMinOptions.forEach((min) => {
      expect(
        // @ts-ignore
        analize(cwd, {
          bundlib: { min },
        }),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should work with string main min option", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin("main");

    expect(main ? main.min : null)
      .toEqual(true);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false);
    expect(browser ? browser.min : null)
      .toEqual(false);
    expect(bin ? bin.min : null)
      .toEqual(false);

  });

  test("should work with array min option", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin(["module", "bin"]);

    expect(main ? main.min : null)
      .toEqual(false);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(true);
    expect(browser ? browser.min : null)
      .toEqual(false);
    expect(bin ? bin.min : null)
      .toEqual(true);

  });

  test("should work with true as min option", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin(true);

    expect(main ? main.min : null)
      .toEqual(true);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(true);
    expect(browser ? browser.min : null)
      .toEqual(true);
    expect(bin ? bin.min : null)
      .toEqual(true);

  });

  test("should work with build min option on CommonJS module", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin(true, "main");

    expect(main ? main.min : null)
      .toEqual(true);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false);
    expect(browser ? browser.min : null)
      .toEqual(false);
    expect(bin ? bin.min : null)
      .toEqual(false);

  });

  test("should work with build min option on ESModule", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin(true, "module");

    expect(main ? main.min : null)
      .toEqual(false);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(true);
    expect(browser ? browser.min : null)
      .toEqual(false);
    expect(bin ? bin.min : null)
      .toEqual(false);

  });

  test("should work with build min option on browser module", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin(true, "browser");

    expect(main ? main.min : null)
      .toEqual(false);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false);
    expect(browser ? browser.min : null)
      .toEqual(true);
    expect(bin ? bin.min : null)
      .toEqual(false);

  });

  test("should work with build min option on binary module", async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin(true, "bin");

    expect(main ? main.min : null)
      .toEqual(false);
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false);
    expect(browser ? browser.min : null)
      .toEqual(false);
    expect(bin ? bin.min : null)
      .toEqual(true);

  });

});
