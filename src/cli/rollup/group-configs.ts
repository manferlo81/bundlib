import type { BundlibRollupConfig } from '../../api/types/rollup';

export function groupConfigs(configs: BundlibRollupConfig[]) {

  // Group configs to process some of them concurrently
  const configGroupsMap = configs.reduce<Record<string, BundlibRollupConfig[]>>((configsMap, config) => {

    // Use input file as group key
    const { input } = config;
    const configSetKey = input;

    const currentConfigList = configsMap[configSetKey] as BundlibRollupConfig[] | undefined;
    const configList = currentConfigList ? [...currentConfigList, config] : [config];

    return { ...configsMap, [configSetKey]: configList };

  }, {});

  // Return only the groups
  return Object.values(configGroupsMap);

}
