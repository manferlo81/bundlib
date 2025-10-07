import type { EventEmitter } from 'node:events'
import type { BundlibEventMap } from './event-map'

export type BundlibEventEmitter = EventEmitter<BundlibEventMap>
