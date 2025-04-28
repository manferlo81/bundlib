import type { DirectoryItems } from 'mock-fs/lib/filesystem';
import type { BundlibPkgJson } from '../../src/api';
import { pkgToConfigs } from '../../src/api';
// eslint-disable-next-line import-x/no-cycle
import { mockAnalyzeWithPkg } from './mock-fs';

export const createConfigs = async (cwd: string, dev: boolean, pkg: BundlibPkgJson, structure: DirectoryItems = {}) => {
  const analyzed = await mockAnalyzeWithPkg(cwd, pkg, structure);
  return pkgToConfigs(analyzed, { dev });
};
