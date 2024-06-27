import resolveFrom from 'resolve-from';
import { hasOwn } from './helpers';

export function createImportFromCWD(cwd: string) {
  return <T>(id: string): T => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, id)) as unknown;
    if (hasOwn<'default', unknown>(content, 'default')) return content.default as T;
    return content as T;
  };
}
