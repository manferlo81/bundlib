import type { RollupError } from 'rollup';
import { cyan, red, yellow } from '../tools/colors';
import type { ConsoleLogFunction } from './console-types';
import { formatTag } from './format';

export function logInfo(logFunction: ConsoleLogFunction, ...messages: string[]): void {
  messages.forEach((message) => {
    logFunction(cyan(message));
  });
}

export function logWarning(logFunction: ConsoleLogFunction, message: string): void {
  const warningTag = formatTag('WARNING', yellow);
  logFunction(`${warningTag} ${yellow(message)}`);
}

export function logError(logFunction: ConsoleLogFunction, err: RollupError | Error): void {
  const errorTag = formatTag('ERROR', red);
  logFunction(`${errorTag} ${red(err.message || err)}`);
  logFunction('');
  if (err.stack) {
    logFunction(err.stack);
    logFunction('');
  }
}
