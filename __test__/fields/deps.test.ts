import analize from "../tools/analize";

describe("package.json dependencies", () => {

  const cwd = process.cwd();

  test("should throw on invalid runtime dependencies", () => {

    return expect(
      // @ts-ignore
      analize(cwd, { dependencies: 100 }),
    ).rejects
      .toThrow(TypeError);

  });

  test("should throw on invalid peer dependencies", () => {

    return expect(
      // @ts-ignore
      analize(cwd, { peerDependencies: 100 }),
    ).rejects
      .toThrow(TypeError);

  });

  test("should throw on invalid optionalDependencies dependencies", () => {

    return expect(
      // @ts-ignore
      analize(cwd, { optionalDependencies: 100 }),
    ).rejects
      .toThrow(TypeError);

  });

  test("should read runtime, peer & optional dependencies", async () => {

    const analized = await analize(cwd, {
      dependencies: {
        "bundelib-dep1": "1.0.0",
      },
      peerDependencies: {
        "bundelib-dep2": "1.0.0",
      },
      optionalDependencies: {
        "bundelib-dep3": "1.0.0",
      },
    });
    const { runtime, peer, optional } = analized.dependencies;

    expect(runtime).toEqual(["bundelib-dep1"]);
    expect(peer).toEqual(["bundelib-dep2"]);
    expect(optional).toEqual(["bundelib-dep3"]);

  });

});
