import { join, parse } from 'path';

export function renamePre(filename: string, pre: string): string {
  const { dir, name, ext } = parse(filename);
  return join(dir, `${name}.${pre}${ext}`);
}
