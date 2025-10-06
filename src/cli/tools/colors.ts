import chalk from 'chalk';

// ENABLE COLORS ON GIT BASH FOR WINDOWS
if (!chalk.level) chalk.level = 1;

export { cyan, green, greenBright, magenta, red, yellow } from 'chalk';
export type { Chalk } from 'chalk';
