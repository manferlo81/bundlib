import { BooleanOptionNameOrder, BooleanOptionNames } from '../types/boolean-options';

export const booleanOptions: BooleanOptionNameOrder = [
  'dev',
  'watch',
  'silent',
];

export const booleanOptionDescMap: Record<BooleanOptionNames, string> = {
  dev: 'create development builds',
  watch: 'run bundlib in watch mode',
  silent: 'prevent messages from showing in the console',
};
