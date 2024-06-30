import { default as chalk } from 'chalk';

// ENABLE COLORS ON GIT BASH FOR WINDOWS
if (!chalk.level) {
  chalk.level = 1;
}

export { black, blackBright, blue, blueBright, bold, cyan, cyanBright, green, greenBright, inverse, magenta, magentaBright, red, redBright, white, whiteBright, yellow, yellowBright, type Chalk } from 'chalk';
