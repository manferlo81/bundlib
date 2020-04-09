import { ChokidarOptions, IsExternal, Plugin, WarningHandlerWithDefault, WatcherOptions as RollupWatcherOptions } from 'rollup';
import { Dictionary, Nullable } from './helper-types';
import { BrowserBuildFormat, BundlibRollupBrowseOutputOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, ModuleBuildFormat, RollupSourcemap } from './types';
import { createOneOf } from './type-check/one-of';

export function createConfig<OutputOptions extends BundlibRollupModuleOutputOptions>(
  input: string,
  output: OutputOptions,
  external: IsExternal,
  plugins: Plugin[],
  onwarn: Nullable<WarningHandlerWithDefault>,
  chokidar: boolean | ChokidarOptions,
): BundlibRollupOptions<OutputOptions> {

  const watch: RollupWatcherOptions = {
    exclude: ['node_modules/**'],
  };

  if (chokidar) {
    watch.chokidar = chokidar === true ? {} : chokidar;
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

export function createModuleConfig(
  input: string,
  format: ModuleBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  external: IsExternal,
  plugins: Plugin[],
  onwarn: Nullable<WarningHandlerWithDefault>,
  chokidar: boolean | ChokidarOptions,
): BundlibRollupOptions<BundlibRollupModuleOutputOptions> {
  return createConfig(
    input,
    { file, format, sourcemap, esModule, interop },
    external,
    plugins,
    onwarn,
    chokidar,
  );
}

const requiresId = createOneOf('amd', 'umd');

export function createBrowserConfig(
  input: string,
  format: BrowserBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  isExternal: IsExternal,
  plugins: Plugin[],
  onwarn: Nullable<WarningHandlerWithDefault>,
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
    onwarn,
    chokidar,
  );

}
