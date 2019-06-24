import { BundlibOptions } from "./bundlib-options";

const validFields: Record<keyof BundlibOptions, true> = ([
  "input",
  "extend",
  "esModule",
  "interop",
  "equals",
  "sourcemap",
  "browser",
  "name",
  "id",
  "globals",
  "min",
] as Array<keyof BundlibOptions>).reduce<Record<keyof BundlibOptions, true>>((result, value) => {
  result[value] = true;
  return result;
}, {} as any);

export function getFirstUnknownOption(options: Record<string, any>): string | null {
  const optionNames = Object.keys(options);
  for (let i = 0, len = optionNames.length; i < len; i++) {
    const name = optionNames[i];
    if (!(validFields as Record<string, true>)[name]) {
      return name;
    }
  }
  return null;
}
