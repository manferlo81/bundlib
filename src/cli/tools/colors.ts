import chalk, { type Chalk as OriginalChalk } from 'chalk';

// ENABLE COLORS ON GIT BASH FOR WINDOWS
if (!chalk.level && 'MINGW_CHOST' in process.env) {
  chalk.level = 1;
}

export type Chalk = OriginalChalk;

export const { bold, inverse } = chalk;
export const { red, green, blue, cyan, magenta, yellow } = chalk;
export const { redBright, greenBright, blueBright, cyanBright, magentaBright, yellowBright } = chalk;
