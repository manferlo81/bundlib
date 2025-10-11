import type { BundlibRollupConfig } from '../../api/options/types/rollup-options'

export function groupConfigs(configs: BundlibRollupConfig[]) {

  // Group configs to process some of them concurrently
  const configGroupsMap = configs.reduce<Record<string, BundlibRollupConfig[]>>((configsMap, config) => {

    // Use input file and format as group key
    const { input, output: { format } } = config
    const formatKey = format === 'es' || format === 'cjs' ? 'module' : 'browser'
    const configSetKey = `${formatKey}:${input}`

    const currentConfigList = configsMap[configSetKey] as BundlibRollupConfig[] | undefined
    const configList = currentConfigList ? [...currentConfigList, config] : [config]

    return { ...configsMap, [configSetKey]: configList }

  }, {})

  // Return only the groups
  return Object.values(configGroupsMap)

}
