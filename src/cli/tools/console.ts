import { EOL } from 'os';
import type { RollupError } from 'rollup';
import { consoleTag } from '../format';
import { cyan, red, yellow } from './colors';

const { log: consoleLog, warn: consoleWarn, error: consoleError } = console as unknown as Record<string, (msg: string) => void>;

export { consoleLog as log };

export function logInfo(message: string) {
  consoleLog(cyan(message));
};

export function logWarning(message: string) {
  const warningTag = consoleTag('WARNING', yellow);
  consoleWarn(`${warningTag} ${yellow(message)}`);
};

export function logError(err: Error | RollupError): void {
  const errorTag = consoleTag('ERROR', red);
  consoleError(`${errorTag} ${red(err.message || err)}${EOL}`);
  if (err.stack) {
    consoleError(`${err.stack}${EOL}`);
  }
}
