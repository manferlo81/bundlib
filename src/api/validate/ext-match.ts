import { extname } from 'path';

export function extensionMatch(filename: string, extensions: string[]): boolean {
  return extensions.includes(extname(filename).toLowerCase());
}
