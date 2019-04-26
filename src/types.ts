import { EventEmitter } from "events";
import { ModuleFormat, OutputOptions as RollupOutputOptions, Plugin, RollupOptions } from "rollup";

export type Some<T, X extends T> = Exclude<T, Exclude<T, X>>;
export type ExcludeProps<T, X extends keyof T> = Pick<T, Exclude<keyof T, X>>;

export type OutputExtra = ExcludeProps<
  RollupOutputOptions,
  "file" | "format" | "sourcemap" | "esModule" | "interop"
>;

export type FilterablePlugins = Array<Plugin | null | false>;
export type ConfigExtra = ExcludeProps<
  RollupOptions,
  "input" | "output" | "external" | "plugins"
>;

export type BuildFormat = Some<ModuleFormat, "cjs" | "es" | "iife" | "amd" | "umd">;

export interface BundlibOptions {

  /**
   * makes bundlib build a development bundle
   * @default false
   */
  dev?: boolean;

  /**
   * makes bundlib to run in watch mode
   * @default false
   */
  watch?: boolean;

}

// tslint:disable-next-line: no-empty-interface
export interface BuildEventEmitter extends EventEmitter {

}

export type BuldFunction = (configs: RollupOptions[], cwd: string) => BuildEventEmitter;
