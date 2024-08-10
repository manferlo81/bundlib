import type { BundlibConfig } from './src/api';

const config: BundlibConfig = {
  input: {
    api: 'src/api/index.ts',
    bin: 'src/cli/index.ts',
  },
  esModule: true,
  interop: true,
  project: 'tsconfig-build.json',
};

export default config;
