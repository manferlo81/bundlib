export type BooleanOptionNameOrder = ['dev', 'silent', 'watch']

type BooleanOptionNames = BooleanOptionNameOrder[number]
type BooleanProgramOptions = Partial<Record<BooleanOptionNames, boolean>>

export type ProgramOptions = BooleanProgramOptions
