import { BundlibOptions } from './src/api/types/bundlib-options';

const config: BundlibOptions = {
  input: {
    api: 'src/api/index.ts',
    bin: 'src/cli/index.ts',
  },
  esModule: true,
  interop: true,
  project: 'tsconfig-build.json',
};

export default config;
