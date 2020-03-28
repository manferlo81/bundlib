import { ESModuleBuildOptions } from '../bundlib-options';
import { createInList } from './in-list';

export const isModuleOptionKey = createInList<keyof ESModuleBuildOptions>(
  'sourcemap',
  'min',
);
