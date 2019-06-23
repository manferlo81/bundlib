import { EventEmitter } from "events";
import { RollupOptions } from "rollup";

export interface BundlibOptions {
  dev?: boolean;
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

export type BuldFunction = (configs: RollupOptions[]) => BuildEventEmitter;
