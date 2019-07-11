import { join as pathJoin } from "path";
import analize from "./tools/analize";

describe("read package.json", () => {

  const cwd = process.cwd();

  test("should throw on no package.json", () => {

    return expect(
      analize(pathJoin(cwd, "dist")),
    ).rejects
      .toThrow();

  });

  test("should throw on invalid folder", () => {

    return expect(
      analize(pathJoin(cwd, "does-not-exist")),
    ).rejects
      .toThrow();

  });

});
