import type { RollupError, RollupLog } from 'rollup';

type NoArgumentsEvents = 'start' | 'end' | 'rebuild';

export interface BundlibEventMap extends Readonly<Record<NoArgumentsEvents, []>> {
  readonly 'file-start': [filename: string];
  readonly 'file-end': [filename: string, size: number, duration: number, cache: boolean];
  readonly warn: [warning: RollupLog];
  readonly error: [error: RollupError];
}
