import type { BuildType, GlobalsOption, SelectiveSkipKey } from './bundlib-options';
import type { ExtractFrom } from './helper-types';

/** @deprecated */
export type BuildTypeForAPI = ExtractFrom<BuildType, 'main' | 'module' | 'browser'>;

/** @deprecated misspelled, use GlobalsOption */
export type GlobalsOptions = GlobalsOption;

/** @deprecated use SelectiveSkipKey */
export type SelectiveSkipBuildType = SelectiveSkipKey;
