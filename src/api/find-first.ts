import { existsSync } from 'fs';

export function findFirst(...filenames: string[]): string | void {
  for (const filename of filenames) {
    if (existsSync(filename)) {
      return filename;
    }
  }
}
