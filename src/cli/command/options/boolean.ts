import type { BooleanOptionNameOrder } from './option-types';

interface FlagDescriptor<F> {
  flag: F;
  desc: string;
}

type BooleanOptionArray<A extends readonly unknown[]> = {
  [K in keyof A]: FlagDescriptor<A[K]>
};

export const booleanOptions: BooleanOptionArray<BooleanOptionNameOrder> = [
  { flag: 'dev', desc: 'create development builds (not minified)' },
  { flag: 'silent', desc: 'prevent messages from showing in the console' },
  { flag: 'watch', desc: 'DEPRECATED! (use watch command)' },
];
