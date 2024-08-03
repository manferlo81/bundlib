import { WarningHandlerWithDefault } from 'rollup';
import { BundlibPkgJson, configsFromPkg } from '../api';
import { build } from './build';
import { EVENT_WARN } from './consts';
import { BundlibEventEmitter } from './types/types';
import { watch as watchBuild } from './watch';

export async function bundlib(
  cwd: string,
  devMode: unknown,
  watchMode: unknown,
  emitter: BundlibEventEmitter,
  pkg: BundlibPkgJson,
): Promise<void> {

  const onwarn: WarningHandlerWithDefault = (warning) => {
    emitter.emit(EVENT_WARN, warning);
  };

  const configs = await configsFromPkg(cwd, { dev: !!devMode, watch: !!watchMode, onwarn }, pkg);

  if (watchMode) {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return watchBuild(configs, emitter);
  }

  build(configs, emitter);

}
