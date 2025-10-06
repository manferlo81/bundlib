import type { BundlibPkgJson } from '../../src/api';
// eslint-disable-next-line import/no-cycle
import { createConfigs } from './create-configs';

export async function getAllPluginNames(cwd: string, dev: boolean, pkg: BundlibPkgJson = {}): Promise<string[][]> {
  const configs = await createConfigs(cwd, dev, pkg);
  return configs.map((config) => {
    return config.plugins.map(({ name }) => name);
  });
}

export async function getPluginNames(cwd: string, dev: boolean, pkg: BundlibPkgJson = {}, index = 0): Promise<string[]> {
  const allNames = await getAllPluginNames(cwd, dev, pkg);
  const names = allNames[index] as string[] | undefined;
  if (!names) throw new Error('No plugins found');
  return names;
}
