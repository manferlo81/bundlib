import { existsSync } from 'fs';
import { resolve } from 'path';
import type { Dictionary, AllowNullish } from '../types/helper-types';

type FindInput = (input: AllowNullish<string>) => AllowNullish<string>;

export function createResolveInput(cwd: string, extensions: string[]): FindInput {

  const searchFiles = extensions.map((ext) => resolve(cwd, 'src', `index${ext}`));
  const cache: Partial<Dictionary<string>> = {};

  return (input: AllowNullish<string>): AllowNullish<string> => {

    const key = input ?? 'null';
    const found = cache[key];

    if (found) {
      return found;
    }

    if (input) {
      const filename = resolve(cwd, input);
      return cache[key] = filename;
    }

    for (const filename of searchFiles) {
      if (existsSync(filename)) {
        return cache[key] = filename;
      }
    }

  };

}
