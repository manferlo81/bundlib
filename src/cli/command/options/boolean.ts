import type { BooleanOptionNameOrder } from './option-types';

type BooleanOptionArray<A extends readonly unknown[]> = {
  [K in keyof A]: { flag: A[K]; desc: string }
};

export const booleanOptions: BooleanOptionArray<BooleanOptionNameOrder> = [
  { flag: 'dev', desc: 'create development builds' },
  { flag: 'watch', desc: 'run bundlib in watch mode' },
  { flag: 'silent', desc: 'prevent messages from showing in the console' },
];
