import { statSync } from 'fs'
import { RollupOptions, watch as rollupWatch } from 'rollup'

import { BuildCallbackObject } from './types'

interface WatchEvent {
  code: string;
  duration: number;
  input: string;
  output: string[];
  error: Error;
}

function watch(configs: RollupOptions[], callbacks: BuildCallbackObject): void {

  const { start, end, buildStart, buildEnd, error } = callbacks

  const ERROR = error && ((event: WatchEvent) => {
    error(event.error)
  })

  const table: Record<string, ((event: WatchEvent) => void) | null | undefined> = {

    START: start && (() => {
      start()
    }),

    END: end && (() => {
      end()
    }),

    BUNDLE_START: buildStart && ((event) => {
      const { output: out } = event
      const { length: len } = out
      for (let i = 0; i < len; i++) {
        buildStart(event.input, out[i])
      }
    }),

    BUNDLE_END: buildEnd && ((event) => {
      const { output: out } = event
      const { length: len } = out
      for (let i = 0; i < len; i++) {
        const stats = statSync(out[i])
        buildEnd(
          out[i],
          stats.size,
          event.duration || 0,
        )
      }
    }),

    ERROR,
    FATAL: ERROR,

  }

  const watcher = rollupWatch(configs)

  watcher.on('event', (event: WatchEvent) => {

    const { code } = event
    const handle = table[code]

    if (handle) {
      handle(event)
    }

  })

}

export default watch
