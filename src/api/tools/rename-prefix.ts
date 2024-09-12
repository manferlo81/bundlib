import { join, parse } from 'node:path';

export function renamePrefixExtension(filename: string, pre: string): string {
  const { dir, name, ext } = parse(filename);
  return join(dir, `${name}.${pre}${ext}`);
}
