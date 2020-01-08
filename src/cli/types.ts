import { RollupError, RollupWarning } from 'rollup'

export interface BundlibOptions {
  dev?: boolean;
  watch?: boolean;
}

export interface BuildCallbackObject {
  start?: () => void;
  end?: () => void;
  buildStart?: (input: string, output: string) => void;
  buildEnd?: (output: string, size: number, duration: number) => void;
  error?: (error: RollupError) => void;
  warn?: (msg: string | RollupWarning) => void;
}
