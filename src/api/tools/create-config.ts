import type { IsExternal, Plugin, WarningHandlerWithDefault } from 'rollup';
import { type AllowNullish } from '../types/helper-types';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../types/types';

interface CreateConfigOptions<OutputOptions extends BundlibRollupModuleOutputOptions> {
  input: string;
  output: OutputOptions;
  isExternal: IsExternal;
  plugins: Plugin[];
  onwarn: AllowNullish<WarningHandlerWithDefault>;
  useChokidar: boolean;
}

export function createConfig<OutputOptions extends BundlibRollupModuleOutputOptions>(options: CreateConfigOptions<OutputOptions>): BundlibRollupOptions<OutputOptions> {
  const { input, output, isExternal: external, plugins, onwarn, useChokidar } = options;
  return {
    input,
    output,
    external,
    plugins,
    watch: {
      exclude: ['node_modules/**'],
      ...useChokidar && { chokidar: {} },
    },
    ...onwarn && { onwarn },
  };
}
