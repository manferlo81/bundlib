import { OptionName } from "./bundlib-options";

function getFirstUnknownOption(options: Record<string, any>): string | null {
  const optionNames = Object.keys(options);
  for (let i = 0, len = optionNames.length; i < len; i++) {
    const name = optionNames[i] as OptionName;
    if (
      name !== "input" &&
      name !== "binInput" &&
      name !== "extend" &&
      name !== "esModule" &&
      name !== "interop" &&
      name !== "equals" &&
      name !== "sourcemap" &&
      name !== "browser" &&
      name !== "name" &&
      name !== "id" &&
      name !== "globals" &&
      name !== "min" &&
      name !== "cache"
    ) {
      return name;
    }
  }
  return null;
}

export default getFirstUnknownOption;
