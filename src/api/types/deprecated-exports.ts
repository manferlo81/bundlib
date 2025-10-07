import type { BuildType, GlobalsOption, SelectiveSkipKey } from './bundlib-options'
import type { ExtractStrict } from './helper-types'

/** @deprecated */
export type BuildTypeForAPI = ExtractStrict<BuildType, 'main' | 'module' | 'browser'>

/** @deprecated misspelled, use GlobalsOption */
export type GlobalsOptions = GlobalsOption

/** @deprecated use SelectiveSkipKey */
export type SelectiveSkipBuildType = SelectiveSkipKey
