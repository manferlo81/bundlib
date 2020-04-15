import { IsExternal, Plugin, WarningHandlerWithDefault, WatcherOptions as RollupWatcherOptions } from 'rollup';
import { Nullable } from './helper-types';
import { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from './types';

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
