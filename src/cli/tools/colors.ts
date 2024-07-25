import chalk from 'chalk';

// ENABLE COLORS ON GIT BASH FOR WINDOWS
if (!chalk.level) {
  chalk.level = 1;
}

export { black, blackBright, blue, blueBright, cyan, cyanBright, green, greenBright, magenta, magentaBright, red, redBright, white, whiteBright, yellow, yellowBright, type Chalk } from 'chalk';
