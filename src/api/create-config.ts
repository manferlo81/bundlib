import { Plugin, WatchOptions as RollupWatchOptions } from "rollup";

import arrayToExternal from "./array-to-external";
import createOutput from "./create-output";
import keysOrNull from "./keys-or-null";
import {
  BrowserBuildFormat,
  BundlibRollupBrowseOutputOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
  FilterablePlugins,
  ModuleBuildFormat,
  Nullable,
  RollupSourcemap,
} from "./types";

export function createConfig<OutputOptions extends BundlibRollupModuleOutputOptions>(
  input: string,
  output: OutputOptions,
  external: Nullable<string[]>,
  plugins: FilterablePlugins,
  chokidar: boolean | RollupWatchOptions,
): BundlibRollupOptions<OutputOptions> {

  return {

    input,
    output,

    external: !external ? () => false : arrayToExternal(external),

    plugins: plugins.filter<Plugin>(Boolean as any),

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
  external: Nullable<string[]>,
  plugins: FilterablePlugins,
  chokidar: boolean | RollupWatchOptions,
): BundlibRollupOptions<BundlibRollupModuleOutputOptions> {

  const output = createOutput(
    format,
    file,
    sourcemap,
    esModule,
    interop,
  );

  return createConfig(
    input,
    output,
    external,
    plugins,
    chokidar,
  );

}

export function createBrowserConfig(
  input: string,
  format: BrowserBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  plugins: FilterablePlugins,
  chokidar: boolean | RollupWatchOptions,
  name: string,
  extend: boolean,
  globals: Nullable<Record<string, string>>,
  id: Nullable<string>,
): BundlibRollupOptions<BundlibRollupBrowseOutputOptions> {

  const extra: Pick<BundlibRollupBrowseOutputOptions, "name" | "extend" | "globals" | "amd"> = {
    name,
    extend,
    globals: globals || {},
  };

  if (id && (format === "umd" || format === "amd")) {
    extra.amd = {
      id,
    };
  }

  const output: BundlibRollupBrowseOutputOptions = createOutput(
    format,
    file,
    sourcemap,
    esModule,
    interop,
    extra,
  );

  return createConfig(
    input,
    output,
    keysOrNull(globals),
    plugins,
    chokidar,
  );

}
