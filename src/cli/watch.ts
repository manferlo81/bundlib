import { statSync } from 'fs'
import { RollupError, RollupOptions, RollupWatcherEvent, watch as rollupWatch } from 'rollup'
import { BuildCallbackObject } from './types'

function watch(configs: RollupOptions[], callbacks: BuildCallbackObject): void {

  const { start, end, buildStart, buildEnd, error } = callbacks

  const ERROR = error && ((event: RollupWatcherEvent & { error: RollupError }) => {
    error(event.error)
  })

  const table: Record<string, ((event: RollupWatcherEvent) => void) | null | undefined> = {

    START: start && (() => {
      start()
    }),

    END: end && (() => {
      end()
    }),

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    BUNDLE_START: buildStart && ((event: RollupWatcherEvent & { output: string; input: string }) => {
      const { output: out } = event
      const { length: len } = out
      for (let i = 0; i < len; i++) {
        buildStart(event.input, out[i])
      }
    }),

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    BUNDLE_END: buildEnd && ((event: RollupWatcherEvent & { output: string; duration: number }) => {
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ERROR,

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    FATAL: ERROR,

  }

  const watcher = rollupWatch(configs)

  watcher.on('event', (event) => {

    const { code } = event
    const handle = table[code]

    if (handle) {
      handle(event)
    }

  })

}

export default watch
