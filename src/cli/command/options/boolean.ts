import type { BooleanOptionNameOrder } from '../types/cli-options';

type ArrayMap<A = BooleanOptionNameOrder> = {
  [K in keyof A]: K extends ('0' | '1' | '2') ? { flag: A[K]; desc: string } : never;
};

export const booleanOptions: ArrayMap = [
  { flag: 'dev', desc: 'create development builds' },
  { flag: 'watch', desc: 'run bundlib in watch mode' },
  { flag: 'silent', desc: 'prevent messages from showing in the console' },
];
