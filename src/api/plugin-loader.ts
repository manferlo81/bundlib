import { PluginImpl } from 'rollup'
import { Dictionary, Nullable, StrictNullable } from './helper-types'
import isDepInstalled from './is-dep-installed'

async function pluginLoader<T extends PluginImpl>(name: string, others: StrictNullable<string[]>, exportName: string, dependencies: Nullable<Dictionary<string>>): Promise<StrictNullable<T>> {
  return (isDepInstalled(name, dependencies) && (!others || others.every((n) => isDepInstalled(n, dependencies))))
    ? (await import(name))[exportName]
    : null
}

export default pluginLoader
