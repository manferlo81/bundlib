import type { ProgramOptions } from '../command/types/cli-options'
import type { ConsoleLogFunction } from '../console/console-types'

export interface ActionContext {
  consoleLog: ConsoleLogFunction
  consoleInfo: ConsoleLogFunction
  consoleWarn: ConsoleLogFunction
  consoleError: ConsoleLogFunction
}

export type ActionFunction = (opts: ProgramOptions, context: ActionContext) => void | Promise<void>
