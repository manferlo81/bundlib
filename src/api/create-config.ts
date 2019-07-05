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
  RollupSourcemap,
} from "./types";

export function createConfig<E extends ConfigExtra>(
  input: string,
  output: BundlibRollupOutputOptions,
  externalOption: Nullable<string[]>,
  plugins: FilterablePlugins,
  extra?: E,
): BundlibRollupOptions & E {

  return Object.assign({

    input,
    output,

    external: !externalOption ? () => false : arrayToExternal(externalOption),

    plugins: plugins.filter<Plugin>(Boolean as any),

  }, extra);

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

  return createConfig(
    input,
    createOutput(
      format,
      file,
      sourcemap,
      esModule,
      interop,
      Object.assign(
        { name, extend },
        globals && { globals },
        id && (format === "umd" || format === "amd") && { amd: { id } },
      ),
    ),
    keysOrNull(globals),
    plugins,
  );

}
