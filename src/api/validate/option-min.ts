import { MinOption, MinString, PerBuildMinOptions } from '../bundlib-options'
import { Nullable } from '../helper-types'
import { createObject, setProp } from '../helpers'
import { createInList } from './in-list'
import { isModuleString } from './option-esmodule'
import { isArray, isBool, isNull } from '../type-check'

export type MinGlobal = Record<MinString, boolean>;

export const isMinString = createInList<MinString>(
  isModuleString,
  'module',
)

export function isValidMinOption(value: unknown): value is MinOption {
  return isNull(value) || isBool(value) || isMinString(value) || (
    isArray<MinString>(value) && value.every((item) => (
      isMinString(item)
    ))
  )
}

export function normalizeMinOption(min: MinOption): MinGlobal {
  const keys: MinString[] = ['main', 'module', 'browser', 'bin']
  return !min ? createObject(keys, false)
    : min === true ? createObject(keys, true)
      : isArray(min) ? min.reduce((result, field) => setProp(field, true, result), createObject(keys, false))
        : setProp(min, true, createObject(keys, false))
}

export function normalizeBuildMin(
  build: Nullable<PerBuildMinOptions>,
  field: MinString,
  def: MinGlobal,
): boolean {
  return (!build || isNull(build.min)) ? def[field] : build.min
}
