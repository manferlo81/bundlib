import type { RollupError } from 'rollup';
import { tag } from '../format';
import { red } from './colors';

export const { log, error } = console as unknown as Record<string, (msg: string) => void>;

export function logError(err: Error | RollupError): void {
  const errorTag = tag(red, 'ERROR');
  error(`${errorTag} ${red(err.message || err)}
`);
  if (err.stack) {
    error(`${err.stack}
`);
  }
}
