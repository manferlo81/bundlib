import { Plugin } from "rollup";

import arrayToExternal from "./array-to-external";
import { Nullable } from "./bundlib-options";
import createOutput from "./create-output";
import keysOrNull from "./keys-or-null";
import {
  BrowserBuildFormat,
  BundlibRollupOptions,
  BundlibRollupOutputOptions,
  ConfigExtra,
  FilterablePlugins,
  ModuleBuildFormat,
  OutputExtra,
  RollupSourcemap,
} from "./types";

export function createConfig(
  input: string,
  output: BundlibRollupOutputOptions,
  external: Nullable<string[]>,
  plugins: FilterablePlugins,
): BundlibRollupOptions;
export function createConfig<E extends ConfigExtra>(
  input: string,
  output: BundlibRollupOutputOptions,
  external: Nullable<string[]>,
  plugins: FilterablePlugins,
  extra: E,
): BundlibRollupOptions & E;
export function createConfig(
  input: string,
  output: BundlibRollupOutputOptions,
  external: Nullable<string[]>,
  plugins: FilterablePlugins,
  extra?: ConfigExtra,
): BundlibRollupOptions {

  const options = {

    input,
    output,

    external: !external ? () => false : arrayToExternal(external),

    plugins: plugins.filter<Plugin>(Boolean as any),

    watch: {
      chokidar: true,
      exclude: ["node_modules/**"],
    },

  };

  return extra ? Object.assign(options, extra) : options;

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
  name: string,
  extend: boolean,
  globals: Nullable<Record<string, string>>,
  id: Nullable<string>,
): BundlibRollupOptions {

  const extra: OutputExtra = { name, extend };

  if (globals) {
    extra.globals = globals;
  }

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
  );

}
