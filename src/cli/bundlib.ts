import { WarningHandlerWithDefault } from 'rollup';
import { BundlibPkgJson, configsFromPkg } from '../api';
import { build } from './build';
import { EVENT_WARN } from './consts';
import { BundlibEventEmitter } from './types/types';
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

  const configs = await configsFromPkg(cwd, { dev, watch, onwarn }, pkg);

  if (watch) {
    return watchBuild(configs, emitter);
  }

  return build(configs, emitter);

}
