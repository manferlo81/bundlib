import analize from "../tools/analize";

describe("package.json dependencies", () => {

  const cwd = process.cwd();

  test("should read dependencies and peerDependencies", async () => {

    const analized = await analize(cwd, {
      dependencies: {
        "bundelib-dep1": "1.0.0",
      },
      peerDependencies: {
        "bundelib-dep2": "1.0.0",
      },
    });

    const { runtime, peer } = analized.dependencies;

    expect(runtime).toContain("bundelib-dep1");
    expect(peer).toContain("bundelib-dep2");

  });

});
