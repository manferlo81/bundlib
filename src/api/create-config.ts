import { OutputOptions as RollupOutputOptions, Plugin, WatchOptions as RollupWatchOptions } from "rollup";

import arrayToExternal from "./array-to-external";
import createOutput from "./create-output";
import keysOrNull from "./keys-or-null";
import {
  BrowserBuildFormat,
  BundlibRollupOptions,
  BundlibRollupOutputOptions,
  FilterablePlugins,
  ModuleBuildFormat,
  Nullable,
  RollupSourcemap,
} from "./types";

export function createConfig(
  input: string,
  output: BundlibRollupOutputOptions,
  external: Nullable<string[]>,
  plugins: FilterablePlugins,
  chokidar: boolean | RollupWatchOptions,
): BundlibRollupOptions {

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
): BundlibRollupOptions {

  return createConfig(
    input,
    createOutput(
      format,
      file,
      sourcemap,
      esModule,
      interop,
    ),
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
): BundlibRollupOptions {

  const extra: RollupOutputOptions = {
    name,
    extend,
    globals: globals || {},
  };

  if (id && (format === "umd" || format === "amd")) {
    extra.amd = {
      id,
    };
  }

  return createConfig(
    input,
    createOutput(
      format,
      file,
      sourcemap,
      esModule,
      interop,
      extra,
    ),
    keysOrNull(globals),
    plugins,
    chokidar,
  );

}
