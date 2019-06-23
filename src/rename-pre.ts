import { join, parse } from "path";

function renamePre(filename: string, pre: string): string {
  const { dir, name, ext } = parse(filename);
  return join(dir, `${name}.${pre}${ext}`);
}

export default renamePre;
