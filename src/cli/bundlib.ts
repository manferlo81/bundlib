import { EventEmitter } from 'events';
import { RollupWarning } from 'rollup';
import { BundlibPkgJson, configsFromPkg } from '../api';
import { build } from './build';
import { WARN } from './events';
import { watch as watchBuild } from './watch';

export async function bundlib(
  cwd: string,
  dev: boolean,
  watch: boolean,
  emitter: EventEmitter,
  pkg?: BundlibPkgJson,
): Promise<void> {

  const onwarn = (warning: string | RollupWarning) => {
    emitter.emit(WARN, warning);
  };

  (watch ? watchBuild : build)(
    await configsFromPkg(cwd, { dev, watch, onwarn }, pkg),
    emitter,
  );

}
