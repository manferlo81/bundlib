import { isArray, isString } from "./type-check";

function normalizeGlobals(
  browserGlobals: Record<string, string> | string[] | null | undefined,
): Record<string, string> | null {
  return !browserGlobals
    ? null
    : isArray(browserGlobals)
      ? browserGlobals.reduce<Record<string, string>>((result, value) => {
        if (isString(value)) {
          result[value] = value;
        }
        return result;
      }, {})
      : browserGlobals;
}

export default normalizeGlobals;
