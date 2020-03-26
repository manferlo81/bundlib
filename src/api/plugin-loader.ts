import resolveFrom from 'resolve-from'
import { PluginImpl } from 'rollup'
import { Dictionary, Nullable, StrictNullable } from './helper-types'
import isDepInstalled from './is-dep-installed'

function createPluginLoader(cwd: string, dependencies: Nullable<Dictionary<string>>) {

  return <T extends PluginImpl>(name: string, exportName?: string | null): StrictNullable<T> => {
    if (!isDepInstalled(name, dependencies)) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(resolveFrom(cwd, name))
    return exportName ? content[exportName] : ('default' in content) ? content.default : content
  }

}

export default createPluginLoader
