import { resolve } from 'path';

export function fixturePath(projectName: string) {
  return resolve('__test__', 'fixtures', projectName);
}
