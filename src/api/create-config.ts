import {
  ExternalOption,
  Plugin,
} from "rollup";

import createOutput from "./create-output";
import {
  BrowserBuildFormat,
  BundlibRollupOptions,
  BundlibRollupOutputOptions,
  ConfigExtra,
  FilterablePlugins,
  ModuleBuildFormat,
  RollupSourcemap,
} from "./types";

export function createConfig(
  input: string,
  output: BundlibRollupOutputOptions,
  external: ExternalOption,
  plugins: FilterablePlugins,
  extra?: ConfigExtra,
): BundlibRollupOptions {

  return Object.assign({

    input,
    output,
    external,

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
  external: ExternalOption,
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
  globals?: Record<string, string> | null,
  id?: string | null,
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
    globals ? Object.keys(globals) : [],
    plugins,
  );

}
