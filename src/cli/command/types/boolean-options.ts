export type BooleanOptionNameOrder = ['dev', 'watch', 'silent'];
export type BooleanOptionNames = BooleanOptionNameOrder[number];
export type BooleanProgramOptions = Partial<Record<BooleanOptionNames, boolean>>;
