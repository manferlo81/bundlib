import type { BooleanOptionNameOrder } from '../types/cli-options';

interface FlagDescriptor<F> {
  flag: F;
  short: string;
  desc: string;
}

type BooleanOptionArray<A extends readonly unknown[]> = {
  [K in keyof A]: FlagDescriptor<A[K]>
};

export const booleanOptions: BooleanOptionArray<BooleanOptionNameOrder> = [
  { flag: 'dev', short: 'd', desc: 'create development builds (not minified)' },
  { flag: 'silent', short: 's', desc: 'prevent messages from showing in the console' },
  { flag: 'watch', short: 'w', desc: 'DEPRECATED! (use watch command)' },
];
