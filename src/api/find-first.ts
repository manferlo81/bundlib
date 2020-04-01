import { existsSync } from 'fs';
import { StrictNullable } from './helper-types';

export function findFirst(...filenames: string[]): StrictNullable<string> {
  for (const filename of filenames) {
    if (existsSync(filename)) {
      return filename;
    }
  }
  return null;
}
