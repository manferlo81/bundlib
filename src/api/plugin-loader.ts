import { PluginImpl } from 'rollup'
import { Dictionary, Nullable, StrictNullable } from './helper-types'
import isDepInstalled from './is-dep-installed'

function createPluginLoader(cwd: string, dependencies: Nullable<Dictionary<string>>) {

  return <T extends PluginImpl>(name: string, others: StrictNullable<string[]>, exportName: string): StrictNullable<T> => {
    if (!isDepInstalled(name, dependencies) || (others && others.some((n) => !isDepInstalled(n, dependencies)))) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const content = require(require.resolve(name, { paths: [cwd] }))
    return exportName !== 'default' ? content[exportName] : ('default' in content) ? content.default : content
  }

}

export default createPluginLoader
