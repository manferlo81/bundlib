import { IsExternal, Plugin, WatchOptions as RollupWatchOptions } from "rollup";

import { createInList } from "./in-list";
import {
  BrowserBuildFormat,
  BundlibRollupBrowseOutputOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
  ModuleBuildFormat,
  Nullable,
  RollupSourcemap,
} from "./types";

export function createConfig<OutputOptions extends BundlibRollupModuleOutputOptions>(
  input: string,
  output: OutputOptions,
  external: IsExternal,
  plugins: Plugin[],
  chokidar: boolean | RollupWatchOptions,
): BundlibRollupOptions<OutputOptions> {

  return {

    input,
    output,

    external,

    plugins,

    watch: {
      chokidar,
      exclude: ["node_modules/**"],
    },

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
  chokidar: boolean | RollupWatchOptions,
): BundlibRollupOptions<BundlibRollupModuleOutputOptions> {
  return createConfig(
    input,
    { file, format, sourcemap, esModule, interop },
    external,
    plugins,
    chokidar,
  );
}

const requiresId = createInList("amd", "umd");

export function createBrowserConfig(
  input: string,
  format: BrowserBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  isExternal: IsExternal,
  plugins: Plugin[],
  chokidar: boolean | RollupWatchOptions,
  name: string,
  extend: boolean,
  globals: Nullable<Record<string, string>>,
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
