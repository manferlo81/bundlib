import keys from "./obj-keys";

function depNames(deps: Record<string, any> | null | undefined): string[] | null {
  return deps ? keys(deps) : null;
}

export default depNames;
