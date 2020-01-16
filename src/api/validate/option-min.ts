import { MinOption, BuildType, PerBuildMinOptions } from '../bundlib-options'
import { Nullable } from '../helper-types'
import { createObject, setProp } from '../helpers'
import { createInList } from './in-list'
import { isModuleString } from './option-esmodule'
import { isArray, isBool, isNull } from '../type-check'

export type MinGlobal = Record<BuildType, boolean>;

export const isMinString = createInList<BuildType>(
  isModuleString,
  'module',
)

export function isValidMinOption(value: unknown): value is MinOption {
  return isNull(value) || isBool(value) || isMinString(value) || (
    isArray<BuildType>(value) && value.every((item) => (
      isMinString(item)
    ))
  )
}

export function normalizeMinOption(min: MinOption): MinGlobal {
  const keys: BuildType[] = ['main', 'module', 'browser', 'bin']
  return !min ? createObject(keys, false)
    : min === true ? createObject(keys, true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), createObject(keys, false))
        : setProp(min, true, createObject(keys, false))
}

export function normalizeBuildMin(
  build: Nullable<PerBuildMinOptions>,
  field: BuildType,
  def: MinGlobal,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min
}
