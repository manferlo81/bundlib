import type { ProgramOptions } from './cli-options'

export type ProgramAction = (opts: ProgramOptions) => void | Promise<void>
