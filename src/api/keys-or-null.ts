import { Nullable } from "./helper-types";
import { keys } from "./helpers";

function keysOrNull(deps: Nullable<Record<string, any>>): string[] | null {
  return deps ? keys(deps) : null;
}

export default keysOrNull;
