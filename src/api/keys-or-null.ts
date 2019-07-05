import { Nullable } from "./bundlib-options";
import keys from "./obj-keys";

function keysOrNull(deps: Nullable<Record<string, any>>): string[] | null {
  return deps ? keys(deps) : null;
}

export default keysOrNull;
