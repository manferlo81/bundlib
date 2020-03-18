import { PluginImpl } from 'rollup'
import isDepInstalled from './is-dep-installed'

async function pluginLoader<T extends PluginImpl>(name: string, exportName: string, ...dependencies: Array<Record<string, string> | null>): Promise<T | null> {
  return isDepInstalled(name, ...dependencies) ? (await import(name))[exportName] : null
}

export default pluginLoader
