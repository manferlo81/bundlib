import { analizePkg, BundlibPkgJson } from '../../src/api';

jest.mock('cosmiconfig');

const analize = (cwd: string, pkg?: BundlibPkgJson): ReturnType<typeof analizePkg> => (
  pkg ? analizePkg(cwd, pkg) : analizePkg(cwd)
);

export default analize;
