import { OptionName } from "./bundlib-options";

function getInvalidOptions(options: Record<string, any>): string[] {
  return Object.keys(options as Record<OptionName, any>).filter((name) => (
    name !== "input" &&
    name !== "bin" &&
    name !== "extend" &&
    name !== "esModule" &&
    name !== "interop" &&
    name !== "equals" &&
    name !== "sourcemap" &&
    name !== "browser" &&
    name !== "format" &&
    name !== "name" &&
    name !== "id" &&
    name !== "globals" &&
    name !== "min" &&
    name !== "cache"
  ));
}

export default getInvalidOptions;
