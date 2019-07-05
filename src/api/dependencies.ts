import keys from "./obj-keys";

function dependencyNames(deps: Record<string, any> | null | undefined): string[] | null {
  return deps ? keys(deps) : null;
}

export default dependencyNames;
