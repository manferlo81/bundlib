import chalk from "chalk";

function create(name: Extract<keyof typeof console, "log" | "error">) {
  const method = console[name];
  return (msg: any) => (
    method(chalk.cyan(msg))
  );
}

export const log = create("log");
export const error = create("error");

export function logError(err: Error) {
  if (err.stack) {
    error(err.stack);
  }
  const tag = chalk.bold.bgWhite.red.inverse(" error ");
  error(`${tag} ${err.message || err}`);
}
