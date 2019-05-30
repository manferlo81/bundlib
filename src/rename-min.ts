import { join, parse } from "path";

function renameMin(filename: string): string {
  const { dir, name, ext } = parse(filename);
  return join(dir, name + ".min" + ext);
}

export default renameMin;
