import { EventEmitter } from "events";
import {
  ModuleFormat as RollupModuleFormat,
  OutputOptions as RollupOutputOptions,
  Plugin,
  RollupOptions,
} from "rollup";

export type OutputExtra = Omit<
  RollupOutputOptions,
  "file" | "format" | "sourcemap" | "esModule" | "interop"
>;

export type FilterablePlugins = Array<Plugin | null | false>;
export type ConfigExtra = Omit<
  RollupOptions,
  "input" | "output" | "external" | "plugins"
>;

export type ModuleBuildFormat = Extract<RollupModuleFormat, "cjs" | "es">;
export type BrowserBuildFormat = Extract<RollupModuleFormat, "iife" | "amd" | "umd">;

export type BundlibBuildFormat = ModuleBuildFormat | BrowserBuildFormat;

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

  silent?: boolean;

}

export type EventBuilding = "BUILDING";
export type EventBuilt = "BUILT";

export type EventWriting = "WRITING";
export type EventWritten = "WRITTEN";

export type EventError = "ERROR";

export interface BuildEventEmitter extends EventEmitter {

  on(event: EventWriting | EventWritten, listener: (filename: string) => void): this;
  on(event: EventError, listener: (error: Error) => void): this;
  on(event: EventBuilding | EventBuilt, listener: () => void): this;

  emit(event: EventWriting | EventWritten, filename: string): boolean;
  emit(event: EventError, error: Error): boolean;
  emit(event: EventBuilding | EventBuilt): boolean;

}

export type BuildEventEmitterOrPromise = BuildEventEmitter | Promise<BuildEventEmitter>;
export type BuldFunction = (configs: RollupOptions[]) => BuildEventEmitterOrPromise;
