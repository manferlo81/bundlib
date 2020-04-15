import { join, resolve } from 'path';

const fixtures = resolve('__test__', 'fixtures');

export function fixturePath(projectName: string) {
  return join(fixtures, projectName);
}
