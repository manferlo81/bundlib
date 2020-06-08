import resolveFrom from 'resolve-from';

export function createImportFromCWD(cwd: string) {
  return <T>(id: string, name?: string | null): T => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, id)) as unknown;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (name ? content[name] : ('default' in content) ? content.default : content) as T;
  };
}
