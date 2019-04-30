import {
  EventBuilding,
  EventBuilt,
  EventError,
  EventRebuilding,
  EventWatching,
  EventWriting,
  EventWritten,
} from "./types";

export const BUILDING: EventBuilding = "BUILDING";
export const BUILT: EventBuilt = "BUILT";

export const WRITING: EventWriting = "WRITING";
export const WRITTEN: EventWritten = "WRITTEN";

export const REBUILDING: EventRebuilding = "REBUILDING";
export const WATCHING: EventWatching = "WATCHING";

export const ERROR: EventError = "ERROR";
