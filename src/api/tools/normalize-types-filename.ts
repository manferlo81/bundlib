import { join, resolve } from 'node:path';
import { fileExtensionMatch } from './extension-match';

export function normalizeExpectedTypesFilename(cwd: string, typesPath: string): `${string}.ts` {
  // check if path is a filename or a directory
  const pathIsFilename = fileExtensionMatch(typesPath, ['.ts'] as const);

  // normalize types filename, making sure it points to a file
  const relativeFilename = pathIsFilename
    ? typesPath
    : join(typesPath, 'index.d.ts');

  // return absolute file path
  return resolve(cwd, relativeFilename) as `${string}.ts`;
}
