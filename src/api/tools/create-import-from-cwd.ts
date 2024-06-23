import resolveFrom from 'resolve-from';
import { hasOwn } from './helpers';

// export function createImportFromCWD(cwd: string) {
//   return <T>(id: string, name?: string | null): T => {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const content = require(resolveFrom(cwd, id)) as unknown;
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     return (name ? content[name] : ('default' in content) ? content.default : content) as T;
//   };
// }

export function createImportFromCWD(cwd: string) {
  return <T>(id: string): T => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, id)) as unknown;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    return (hasOwn.call(content, 'default') ? (content as Record<'default', unknown>).default : content) as T;
  };
}
