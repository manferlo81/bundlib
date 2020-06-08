import { red } from 'chalk';
import { RollupError } from 'rollup';

function create(name: 'log' | 'error') {
  const method = console[name];
  return (msg: string) => method(msg);
}

export const log = create('log');
export const error = create('error');

export function logError(err: Error | RollupError): void {
  if (err.stack) {
    error(err.stack);
  }
  const tag = red.bgWhite.inverse(' error ');
  // const tag = chalk.bold.bgWhite.red.inverse(' error ');
  error(`${tag} ${red(err.message || err)}`);
}
