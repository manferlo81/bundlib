import loadJsonFile from 'load-json-file';
import { join as pathJoin } from 'path';

export function readPkg<T>(cwd: string): Promise<T> {
  return loadJsonFile<T>(pathJoin(cwd, 'package.json'));
}
