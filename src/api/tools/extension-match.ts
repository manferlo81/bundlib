import { extname } from 'path';

export function extensionMatch(filename: string, extensions: readonly string[]): boolean {
  return extensions.includes(extname(filename).toLowerCase());
}
