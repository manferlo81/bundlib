import type { GlobalsOption } from './bundlib-options'
import type { ExtractStrict } from './helper-types'
import type { BuildType, SkippableBuildType } from './options/build-type'

/** @deprecated */
export type BuildTypeForAPI = ExtractStrict<BuildType, 'main' | 'module' | 'browser'>

/** @deprecated misspelled, use GlobalsOption */
export type GlobalsOptions = GlobalsOption

/** @deprecated use SelectiveSkipKey */
export type SelectiveSkipBuildType = SkippableBuildType
