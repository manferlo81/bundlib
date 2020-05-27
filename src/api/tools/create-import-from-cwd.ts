import resolveFrom from 'resolve-from';
import { IsInstalled } from '../helper-types';

export function createImportFromCWD(cwd: string, isInstalled: IsInstalled) {
  return <T>(id: string, name?: string | null): T | void => {
    if (!isInstalled(id)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, id));
    return name ? content[name] : ('default' in content) ? content.default : content;
  };
}
