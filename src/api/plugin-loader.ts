import resolveFrom from 'resolve-from'
import { PluginImpl } from 'rollup'
import { IsInstalled, StrictNullable } from './helper-types'

function createPluginLoader(cwd: string, isInstalled: IsInstalled) {

  return <T extends PluginImpl>(name: string, exportName?: string | null): StrictNullable<T> => {
    if (!isInstalled(name)) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, name))
    return exportName ? content[exportName] : ('default' in content) ? content.default : content
  }

}

export default createPluginLoader
