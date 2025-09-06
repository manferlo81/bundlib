import type { RollupError } from 'rollup';
import type { Chalk } from './colors';
import { cyan, green, red, yellow } from './colors';

export type LogFunction = (mgs: string) => void;

type SimpleConsole = Record<Extract<keyof Console, 'log' | 'warn' | 'error'>, LogFunction>;
export const { log: consoleLog, warn: consoleWarn, error: consoleError } = console as SimpleConsole;

export function logInfo(fn: LogFunction, ...messages: string[]): void {
  messages.forEach((message) => {
    fn(cyan(message));
  });
}

export function logWarning(fn: LogFunction, message: string): void {
  const warningTag = consoleTag('WARNING', yellow);
  fn(`${warningTag} ${yellow(message)}`);
}

export function logError(fn: LogFunction, err: RollupError | Error): void {
  const errorTag = consoleTag('ERROR', red);
  fn(`${errorTag} ${red(err.message || err)}`);
  fn('');
  if (err.stack) {
    fn(err.stack);
    fn('');
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
