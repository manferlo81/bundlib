import { ModuleOption, ModuleString, PerBuildModuleOptions } from './bundlib-options'
import { Nullable } from './helper-types'
import { createObject, setProp } from './helpers'
import { createInList } from './in-list'
import { isArray, isBool, isNull } from './type-check'

export type ModuleGlobal = Record<ModuleString, boolean>;

export const isModuleString = createInList<ModuleString>(
  'main',
  'browser',
  'bin',
)

export function isModuleOption(value: unknown): value is ModuleOption {
  return isNull(value) || isBool(value) || isModuleString(value) || (
    isArray<unknown>(value) && value.every(isModuleString)
  )
}

export function normalizeModuleOption(option: ModuleOption): ModuleGlobal {
  const keys: ModuleString[] = ['main', 'browser', 'bin']
  return !option ? createObject(keys, false)
    : option === true ? createObject(keys, true)
      : isArray(option) ? option.reduce((result, field) => setProp(field, true, result), createObject(keys, false))
        : setProp(option, true, createObject(keys, false))
}

export function normalizeBuildModule(
  build: Nullable<PerBuildModuleOptions>,
  key: keyof PerBuildModuleOptions,
  field: ModuleString,
  def: ModuleGlobal,
): boolean {
  return (!build || isNull(build[key])) ? def[field] : build[key] as boolean
}
