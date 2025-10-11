import type { BuildType, SkippableBuildType } from '../options/types/build-type'
import type { GlobalsOption } from '../options/types/bundlib'
import type { ExtractStrict } from './helper-types'

/** @deprecated */
export type BuildTypeForAPI = ExtractStrict<BuildType, 'main' | 'module' | 'browser'>

/** @deprecated misspelled, use GlobalsOption */
export type GlobalsOptions = GlobalsOption

/** @deprecated use SelectiveSkipKey */
export type SelectiveSkipBuildType = SkippableBuildType
