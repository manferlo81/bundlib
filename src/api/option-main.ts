import { CommonJSBuildOptions } from "./bundlib-options";
import { createInList } from "./in-list";
import { isModuleOptionKey } from "./option-module";

export const isCJSOptionKey = createInList<keyof CommonJSBuildOptions>(
  isModuleOptionKey,
  "esModule",
  "interop",
);
