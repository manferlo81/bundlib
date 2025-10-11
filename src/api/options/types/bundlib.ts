import type { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from 'selective-option'
import type { Dictionary, MaybeNullish } from '../../types/helper-types'
import type { BuildType, SkippableBuildType } from './build-type'
import type { BundlibNonBooleanESModuleOption, BundlibNonBooleanInteropOption, BundlibNonBooleanSourcemapOption, BundlibOutputFormat } from './rollup'

// Selective Option Types

export type SelectiveSpecialKey = 'api'
export type SelectiveKey<K extends string> = K | SelectiveSpecialKey
export type OverrideKey = 'default'
export type SelectiveObjectKey<K extends string> = SelectiveKey<K> | OverrideKey

export type SelectiveValueBasedOption<K extends string, V> = ValueBasedSelectiveOption<K, SelectiveSpecialKey | OverrideKey, V>
export type SelectiveBoolBasedOption<K extends string, V> = BoolBasedSelectiveOption<K, SelectiveSpecialKey, V, OverrideKey>

// Selective Options

export type SelectiveStringOption = SelectiveValueBasedOption<BuildType, string>
export type SelectiveSourcemapOption = SelectiveBoolBasedOption<BuildType, BundlibNonBooleanSourcemapOption>
export type SelectiveEsModuleOption = SelectiveBoolBasedOption<BuildType, BundlibNonBooleanESModuleOption>
export type SelectiveInteropOption = SelectiveBoolBasedOption<BuildType, BundlibNonBooleanInteropOption>
export type SelectiveMinOption = SelectiveBoolBasedOption<BuildType, never>
export type SelectiveSkipOption = SelectiveBoolBasedOption<SkippableBuildType, never>

// Bundlib Options

export type GlobalsOption = MaybeNullish<Dictionary<string> | string[]>

export type StringOption = MaybeNullish<string>
export type BooleanOption = MaybeNullish<boolean>

export interface BundlibConfig {

  readonly input?: SelectiveStringOption

  readonly sourcemap?: SelectiveSourcemapOption
  readonly esModule?: SelectiveEsModuleOption
  readonly interop?: SelectiveInteropOption
  readonly min?: SelectiveMinOption
  readonly skip?: SelectiveSkipOption
  readonly project?: SelectiveStringOption

  readonly cache?: StringOption
  readonly chunks?: MaybeNullish<Dictionary<string>>

  readonly format?: MaybeNullish<BundlibOutputFormat>
  readonly name?: StringOption
  readonly id?: StringOption
  readonly extend?: BooleanOption
  readonly globals?: GlobalsOption

  readonly equals?: BooleanOption

}
