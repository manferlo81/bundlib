import { keys } from "./helpers";
import { Nullable } from "./types";

function keysOrNull(deps: Nullable<Record<string, any>>): string[] | null {
  return deps ? keys(deps) : null;
}

export default keysOrNull;
