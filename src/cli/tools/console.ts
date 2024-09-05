import type { RollupError } from 'rollup';
import type { Chalk } from './colors';
import { cyan, green, red, yellow } from './colors';

const { log: consoleLog, warn: consoleWarn, error: consoleError } = console as unknown as Record<string, (msg: string) => void>;

export function logInfo(...messages: string[]): void {
  messages.forEach((message) => {
    consoleLog(cyan(message));
  });
}

export function logWarning(message: string): void {
  const warningTag = consoleTag('WARNING', yellow);
  consoleWarn(`${warningTag} ${yellow(message)}`);
}

export function logError(err: Error | RollupError): void {
  const errorTag = consoleTag('ERROR', red);
  consoleError(`${errorTag} ${red(err.message || err)}`);
  consoleLog('');
  if (err.stack) {
    consoleError(err.stack);
    consoleLog('');
  }
}

export function consoleTag(text: string, color: Chalk): string {
  return color.inverse.bold(` ${text} `);
}

export function formatProjectInfo(name: string, ver: string): string {
  const projName = green.bold(name);
  const projVer = yellow.bold(`v${ver}`);
  return `${projName} ${projVer}`;
}
