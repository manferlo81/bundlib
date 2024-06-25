import { EventEmitter } from 'events';
import { RollupError, RollupWarning } from 'rollup';

export interface BundlibEventEmitter extends EventEmitter {
  on(event: 'start', listener: () => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'build-start', listener: (filename: string) => void): this;
  on(event: 'build-end', listener: (filename: string, size: number, duration: number) => void): this;
  on(event: 'rebuild', listener: (index: number) => void): this;
  on(event: 'warn', listener: (warning: RollupWarning) => void): this;
  on(event: 'error', listener: (error: RollupError) => void): this;
  //
  emit(event: 'start'): boolean;
  emit(event: 'end'): boolean;
  emit(event: 'build-start', filename: string): boolean;
  emit(event: 'build-end', filename: string, size: number, duration: number): boolean;
  emit(event: 'rebuild', index: number): boolean;
  emit(event: 'warn', warning: RollupWarning): boolean;
  emit(event: 'error', error: RollupError): boolean;
}
