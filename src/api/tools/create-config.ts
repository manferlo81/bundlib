import type { IsExternal, Plugin, WarningHandlerWithDefault, WatcherOptions as RollupWatcherOptions } from 'rollup';
import type { Nullable } from '../types/helper-types';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../types/types';

export function createConfig<OutputOptions extends BundlibRollupModuleOutputOptions>(
  input: string,
  output: OutputOptions,
  external: IsExternal,
  plugins: Plugin[],
  onwarn: Nullable<WarningHandlerWithDefault>,
  chokidar: boolean,
): BundlibRollupOptions<OutputOptions> {

  const watch: RollupWatcherOptions = {
    exclude: ['node_modules/**'],
  };

  if (chokidar) {
    watch.chokidar = {};
  }

  const config: BundlibRollupOptions<OutputOptions> = {
    input,
    output,
    external,
    plugins,
    watch,
  };

  if (onwarn) {
    config.onwarn = onwarn;
  }

  return config;

}
