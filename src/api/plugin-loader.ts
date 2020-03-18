import { PluginImpl } from 'rollup'
import isDepInstalled from './is-dep-installed'

async function pluginLoader<T extends PluginImpl>(name: string, others: string[] | null, exportName: string, ...dependencies: Array<Record<string, string> | null>): Promise<T | null> {
  return (isDepInstalled(name, ...dependencies) && (!others || others.every((n) => isDepInstalled(n, ...dependencies))))
    ? (await import(name))[exportName]
    : null
}

export default pluginLoader
