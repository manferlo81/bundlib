import { existsSync } from 'fs';
import { resolve } from 'path';
import type { Nullable } from '../types/helper-types';

type FindInput = (input: Nullable<string>) => Nullable<string>;

export function createFincInput(cwd: string, extensions: string[]): FindInput {

  const inputSearch = extensions.map((ext) => resolve(cwd, 'src', `index${ext}`));
  const cache = {
    found: false,
    filename: null as string | null,
  };

  return (input: Nullable<string>): Nullable<string> => {

    if (input) {
      return resolve(cwd, input);
    }

    if (cache.found) {
      return cache.filename;
    }

    for (const filename of inputSearch) {
      if (existsSync(filename)) {
        cache.found = true;
        return cache.filename = filename;
      }
    }

    cache.found = true;

  };

}
