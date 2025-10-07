import { statSync } from 'node:fs'
import type { RollupWatcher } from 'rollup'
import { watch } from 'rollup'
import type { BundlibRollupConfig } from '../../api/types/rollup'
import type { BundlibEventEmitter } from '../actions/emitter-types'

export function rollupWatchBuild(
  configs: BundlibRollupConfig[],
  emitter: BundlibEventEmitter,
): RollupWatcher {

  const watcher = watch(configs)

  watcher.on('restart', (): void => {
    emitter.emit('rebuild')
  })

  watcher.on('event', (event): void => {

    switch (event.code) {

      case 'START': return void emitter.emit('start')
      case 'END': return void emitter.emit('end')

      case 'BUNDLE_START': {
        const { output } = event
        return output.forEach((filename) => {
          emitter.emit(
            'file-start',
            filename,
          )
        })
      }

      case 'BUNDLE_END': {
        const { output, duration } = event
        return output.forEach((filename) => {
          const { size } = statSync(filename)
          emitter.emit(
            'file-end',
            filename,
            size,
            duration,
            false,
          )
        })
      }

      case 'ERROR': {
        const { error } = event
        emitter.emit('error', error)
      }

    }

  })

  return watcher
}
