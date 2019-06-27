import { dirname, isAbsolute, join, normalize } from "path";

function resolveId(id: string, cwd: string, from: string | undefined) {
  return isAbsolute(id) ? id : normalize(join(
    from ? dirname(from) : cwd,
    id,
  ));
}

export default resolveId;
