export type BooleanOptionNameOrder = ['dev', 'silent', 'watch'];
export type BooleanOptionNames = BooleanOptionNameOrder[number];
export type BooleanProgramOptions = Partial<Record<BooleanOptionNames, boolean>>;

export type ProgramOptions = BooleanProgramOptions;
