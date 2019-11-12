import { InputOptions } from '../bundlib-options'
import { createInList } from './in-list'

export const isInOpKey = createInList<keyof InputOptions>('api', 'bin')
