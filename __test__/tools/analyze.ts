import { analyzePkg, BundlibPkgJson } from '../../src/api';

jest.mock('cosmiconfig');

const analyze = (cwd: string, pkg?: BundlibPkgJson): ReturnType<typeof analyzePkg> => (
  pkg ? analyzePkg(cwd, pkg) : analyzePkg(cwd)
);

export default analyze;
