import resolveFrom from 'resolve-from';
import { PluginImpl } from 'rollup';
import { IsInstalled, StrictNullable } from './helper-types';

export function createPluginLoader(cwd: string, isInstalled: IsInstalled) {

  return <T extends PluginImpl>(id: string, named?: string | null): StrictNullable<T> => {
    if (!isInstalled(id)) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, id));
    return named ? content[named] : ('default' in content) ? content.default : content;
  };

}
