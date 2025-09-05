export type BooleanOptionNameOrder = ['dev', 'silent', 'watch'];

type BooleanOptionNames = BooleanOptionNameOrder[number];
type BooleanProgramOptions = Partial<Record<BooleanOptionNames, boolean>>;

export type ProgramOptions = BooleanProgramOptions;

export type ActionWithOptions = (opts: ProgramOptions) => void | Promise<void>;
