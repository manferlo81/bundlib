import chalk from 'chalk';
import { RollupError } from 'rollup';

function create(name: Extract<keyof typeof console, 'log' | 'error'>) {
  const method = console[name];
  return (msg: string) => (
    method(chalk.cyan(msg))
  );
}

export const log = create('log');
export const error = create('error');

export function logError(err: Error | RollupError) {
  if (err.stack) {
    error(err.stack);
  }
  const tag = chalk.bold.bgWhite.red.inverse(' error ');
  error(`${tag} ${err.message || err}`);
}
