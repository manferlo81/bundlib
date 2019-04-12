import chalk from "chalk";
import { relative } from "path";

export function log(text?: any, error?: boolean) {
  // tslint:disable-next-line: no-console
  (error ? console.error : console.log)(text || "");
}

export function showError(error: { id?: any }) {
  const tag = chalk.bgRed.white(" error ");
  let text = `${tag} error found`;
  if (error.id) {
    text = `${text} in file ${error.id}`;
  }
  log(text, true);
  log(error, true);
}

export function showInfo(text: string) {
  log(chalk.blueBright(`  >> ${text} <<`));
}

export function written(filename: string, cwd: string) {
  const tag = chalk.greenBright.inverse(" built ");
  filename = chalk.yellow(relative(cwd, filename));
  log(`${tag} ${filename}`);
}
