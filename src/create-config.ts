import {
  ExternalOption,
  OutputOptions as RollupOutputOptions,
  Plugin,
  RollupOptions,
} from "rollup";

import createOutput from "./create-output";
import {
  BrowserBuildFormat,
  ConfigExtra,
  FilterablePlugins,
  ModuleBuildFormat,
  RollupSourcemap,
} from "./types";

export function createConfig(
  input: string,
  output: RollupOutputOptions,
  external: ExternalOption,
  plugins: FilterablePlugins,
  extra?: ConfigExtra,
): RollupOptions {

  const config: RollupOptions = {

    input,
    output,
    external,

    plugins: plugins.filter<Plugin>(Boolean as any),

    ...extra,

  };

  return config;

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
): RollupOptions {

  const output = createOutput(format, file, sourcemap, esModule, interop);

  return createConfig(
    input,
    output,
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
) {

  const output = createOutput(format, file, sourcemap, esModule, interop, {
    name,
    extend,
    ...globals && { globals },
    ...id && (format === "umd" || format === "amd") && { amd: { id } },
  });

  const external = globals ? Object.keys(globals) : [];

  return createConfig(
    input,
    output,
    external,
    plugins,
  );

}
