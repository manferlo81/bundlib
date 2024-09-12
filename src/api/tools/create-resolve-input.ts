import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AllowNullish, AllowVoid, Dictionary } from '../types/helper-types';

type FindInputFunction = (input: AllowNullish<string>) => AllowVoid<AllowNullish<string>>;

export function createResolveInput(cwd: string, extensions: readonly string[]): FindInputFunction {

  const searchFiles = extensions.map((ext) => resolve(cwd, 'src', `index${ext}`));
  const cache: Partial<Dictionary<string>> = {};

  return (input): AllowVoid<AllowNullish<string>> => {

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
