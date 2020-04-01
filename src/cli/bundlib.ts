import { EventEmitter } from 'events';
import { RollupWarning } from 'rollup';
import { BundlibAPIOptions, BundlibPkgJson, configsFromPkg } from '../api';
import { build } from './build';
import { WARN } from './events';
import { watch } from './watch';

async function bundlib(
  cwd: string,
  options: BundlibAPIOptions,
  emitter: EventEmitter,
  pkg?: BundlibPkgJson,
): Promise<void> {

  const configs = await configsFromPkg(cwd, options, pkg);

  const onwarn = (warning: string | RollupWarning) => {
    emitter.emit(WARN, warning);
  };

  configs.forEach((config) => {
    config.onwarn = onwarn;
  });

  (options.watch ? watch : build)(
    configs,
    emitter,
  );

}

export default bundlib;
