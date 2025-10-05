import type { RollupError, RollupLog } from 'rollup';

type NoArgumentsEvents = 'start' | 'end' | 'rebuild';

export interface BundlibEventMap extends Readonly<Record<NoArgumentsEvents, []>> {
  readonly 'build-start': [filename: string];
  readonly 'build-end': [filename: string, size: number, duration: number];
  readonly warn: [warning: RollupLog];
  readonly error: [error: RollupError];
}
