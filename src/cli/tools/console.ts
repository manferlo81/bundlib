import type { RollupError } from 'rollup';
import type { Chalk } from './colors';
import { cyan, green, red, yellow } from './colors';

export type LogFunction = (mgs: string) => void;

type SimpleConsole = Record<Extract<keyof Console, 'log' | 'warn' | 'error'>, LogFunction>;
export const { log: consoleLog, warn: consoleWarn, error: consoleError } = console as SimpleConsole;

export function logInfo(logFunction: LogFunction, ...messages: string[]): void {
  messages.forEach((message) => {
    logFunction(cyan(message));
  });
}

export function logWarning(logFunction: LogFunction, message: string): void {
  const warningTag = consoleTag('WARNING', yellow);
  logFunction(`${warningTag} ${yellow(message)}`);
}

export function logError(logFunction: LogFunction, err: RollupError | Error): void {
  const errorTag = consoleTag('ERROR', red);
  logFunction(`${errorTag} ${red(err.message || err)}`);
  logFunction('');
  if (err.stack) {
    logFunction(err.stack);
    logFunction('');
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
