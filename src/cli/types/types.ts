import type { RollupError, RollupLog } from 'rollup';

type NoArgumentsEvents = 'start' | 'end' | 'rebuild';

export interface BundlibEventMap extends Record<NoArgumentsEvents, []> {
  'build-start': [filename: string];
  'build-end': [filename: string, size: number, duration: number];
  warn: [warning: RollupLog];
  error: [error: RollupError];
}
