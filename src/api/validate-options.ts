import { OptionName } from "./bundlib-options";
import keys from "./obj-keys";

function getInvalidOptions(options: Record<string, any>): string[] {
  return keys(options as Record<OptionName, any>).filter((name) => (
    name !== "input" &&
    name !== "bin" &&
    name !== "extend" &&
    name !== "esModule" &&
    name !== "interop" &&
    name !== "equals" &&
    name !== "sourcemap" &&
    name !== "format" &&
    name !== "name" &&
    name !== "id" &&
    name !== "globals" &&
    name !== "min" &&
    name !== "cache"
  ));
}

export default getInvalidOptions;
