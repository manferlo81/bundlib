import {
  EventBuilding,
  EventBuilt,
  EventError,
  EventWriting,
  EventWritten,
} from "./types";

export const BUILDING: EventBuilding = "BUILDING";
export const BUILT: EventBuilt = "BUILT";

export const WRITING: EventWriting = "WRITING";
export const WRITTEN: EventWritten = "WRITTEN";

export const ERROR: EventError = "ERROR";
