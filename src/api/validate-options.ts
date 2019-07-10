import { BundlibOptions10 } from "./bundlib-options";
import keys from "./obj-keys";

export function invalidKeys(object: Record<string, any>, list: string[]): string[] | null {
  const invalid = keys(object).filter((key) => list.indexOf(key) === -1);
  return invalid.length ? invalid : null;
}

export function getInvalidOptions(options: Record<string, any>): string[] | null {
  return invalidKeys(options, [
    "input",
    "extend",
    "esModule",
    "interop",
    "equals",
    "sourcemap",
    "format",
    "name",
    "id",
    "globals",
    "min",
    "cache",
    "main",
    "module",
    "browser",
    "bin",
    "types",
  ] as Array<keyof BundlibOptions10>);
  // return keys(options as Record<keyof BundlibOptions10, any>).filter((name) => (
  //   name !== "input" &&
  //   name !== "bin" &&
  //   name !== "extend" &&
  //   name !== "esModule" &&
  //   name !== "interop" &&
  //   name !== "equals" &&
  //   name !== "sourcemap" &&
  //   name !== "format" &&
  //   name !== "name" &&
  //   name !== "id" &&
  //   name !== "globals" &&
  //   name !== "min" &&
  //   name !== "cache"
  // ));
}
