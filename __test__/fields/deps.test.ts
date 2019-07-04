import analize from "../tools/analize";

describe("package.json dependencies", () => {

  const cwd = process.cwd();

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
