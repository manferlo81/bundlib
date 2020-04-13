import { Plugin } from 'rollup';
import { BundlibPkgJson } from '../../src/api';
import createConfigs from './create-configs';

async function getPluginNames(cwd: string, dev: boolean, pkg?: BundlibPkgJson): Promise<string[][]> {
  const configs = await createConfigs(cwd, dev, pkg);
  const pluginName = (plugin: Plugin) => plugin.name;
  return configs.map(
    (config) => config.plugins.map(pluginName),
  );
}

export default getPluginNames;
