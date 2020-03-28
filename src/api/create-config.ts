import { ChokidarOptions, IsExternal, Plugin, WatcherOptions as RollupWatcherOptions } from 'rollup';
import { Dictionary, Nullable } from './helper-types';
import { BrowserBuildFormat, BundlibRollupBrowseOutputOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, ModuleBuildFormat, RollupSourcemap } from './types';
import { createInList } from './validate/in-list';

export function createConfig<OutputOptions extends BundlibRollupModuleOutputOptions>(
  input: string,
  output: OutputOptions,
  external: IsExternal,
  plugins: Plugin[],
  chokidar: boolean | ChokidarOptions,
): BundlibRollupOptions<OutputOptions> {

  const watch: RollupWatcherOptions = {
    exclude: ['node_modules/**'],
  };

  if (chokidar) {
    watch.chokidar = chokidar === true ? {} : chokidar;
  }

  return {
    input,
    output,
    external,
    plugins,
    watch,
  };

}

export function createModuleConfig(
  input: string,
  format: ModuleBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  external: IsExternal,
  plugins: Plugin[],
  chokidar: boolean | ChokidarOptions,
): BundlibRollupOptions<BundlibRollupModuleOutputOptions> {
  return createConfig(
    input,
    { file, format, sourcemap, esModule, interop },
    external,
    plugins,
    chokidar,
  );
}

const requiresId = createInList('amd', 'umd');

export function createBrowserConfig(
  input: string,
  format: BrowserBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  isExternal: IsExternal,
  plugins: Plugin[],
  chokidar: boolean | ChokidarOptions,
  name: string,
  extend: boolean,
  globals: Nullable<Dictionary<string>>,
  id: Nullable<string>,
): BundlibRollupOptions<BundlibRollupBrowseOutputOptions> {

  const output: BundlibRollupBrowseOutputOptions = {
    file,
    format,
    sourcemap,
    esModule,
    interop,
    extend,
    name,
    globals: globals || {},
  };

  if (id && requiresId(format)) {
    output.amd = {
      id,
    };
  }

  return createConfig(
    input,
    output,
    isExternal,
    plugins,
    chokidar,
  );

}
