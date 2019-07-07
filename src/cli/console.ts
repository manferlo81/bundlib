import chalk from "chalk";

export function log(msg: any): void {
  // tslint:disable-next-line: no-console
  console.log(msg);
}

export function logError(err: Error) {
  if (err.stack) {
    // tslint:disable-next-line: no-console
    console.error(err.stack);
  }
  // tslint:disable-next-line: no-console
  console.error(`${chalk.bgRed.bold(" error ")} ${err.message || err}`);
}
