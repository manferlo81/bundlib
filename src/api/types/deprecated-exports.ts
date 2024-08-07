import type { BuildType, GlobalsOption, SelectiveSkipKey } from './bundlib-options';
import type { ExtractFrom } from './helper-types';

/** @deprecated */
export type BuildTypeForAPI = ExtractFrom<BuildType, 'main' | 'module' | 'browser'>;

/** @deprecated */
export type GlobalsOptions = GlobalsOption;

/** @deprecated */
export type SelectiveSkipBuildType = SelectiveSkipKey;
