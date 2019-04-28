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

export enum BuildEventType {
  REBUILDING = "REBUILDING",
  WATCHING = "WATCHING",
  WRITTEN = "WRIITEN",
  ERROR = "ERROR",
}

export interface BuildEventEmitter extends EventEmitter {

  on(event: BuildEventType.REBUILDING | BuildEventType.WATCHING, listener: () => void): this;
  on(event: BuildEventType.WRITTEN, listener: (filename: string) => void): this;
  on(event: BuildEventType.ERROR, listener: (error: Error) => void): this;

  emit(event: BuildEventType.REBUILDING | BuildEventType.WATCHING): boolean;
  emit(event: BuildEventType.WRITTEN, filename: string): boolean;
  emit(event: BuildEventType.ERROR, error: Error): boolean;

}

export type BuldFunction = (configs: RollupOptions[]) => BuildEventEmitter;
