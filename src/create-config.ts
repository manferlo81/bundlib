import { ExternalOption, OutputOptions as RollupOutputOptions, Plugin, RollupOptions } from "rollup";
import { BuildFormat, ConfigExtra, FilterablePlugins, OutputExtra, Some } from "./types";

export function createOutput(
  format: BuildFormat,
  file: string,
  sourcemap: boolean,
  esModule: boolean,
  interop: boolean,
  extra?: OutputExtra,
): RollupOutputOptions {

  const output: RollupOutputOptions = {

    file,
    format,

    sourcemap,
    esModule,
    interop,

    ...extra,

  };

  return output;

}

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
  format: Some<BuildFormat, "cjs" | "es">,
  file: string,
  sourcemap: boolean,
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
  format: Some<BuildFormat, "iife" | "umd">,
  file: string,
  sourcemap: boolean,
  esModule: boolean,
  interop: boolean,
  plugins: Array<Plugin | null | false>,
  name: string,
  extend: boolean,
  globals?: Record<string, string>,
  id?: string | null,
) {

  const output = createOutput(format, file, sourcemap, esModule, interop, {
    name,
    extend,
    globals,
  });

  if (id && format === "umd") {
    output.amd = {
      id,
    };
  }

  const external = globals ? Object.keys(globals) : [];

  return createConfig(
    input,
    output,
    external,
    plugins,
  );

}
