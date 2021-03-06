import { WarningHandlerWithDefault } from 'rollup';
import { BundlibPkgJson, configsFromPkg } from '../api';
import { build } from './build';
import { EVENT_WARN } from './consts';
import { BundlibEventEmitter } from './types';
import { watch as watchBuild } from './watch';

export async function bundlib(
  cwd: string,
  dev: boolean,
  watch: boolean,
  emitter: BundlibEventEmitter,
  pkg?: BundlibPkgJson,
): Promise<void> {

  const onwarn: WarningHandlerWithDefault = (warning) => {
    emitter.emit(EVENT_WARN, warning);
  };

  (watch ? watchBuild : build)(
    await configsFromPkg(cwd, { dev, watch, onwarn }, pkg),
    emitter,
  );

}
