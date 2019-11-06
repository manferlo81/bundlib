import { Nullable } from './helper-types'

type InListTarget = Nullable<string | number | boolean>;

export type InList<M extends InListTarget> = (str: unknown) => str is M;

export function createInList<M extends InListTarget>(...model: Array<M | InList<M>>): InList<M> {
  return (str: unknown): str is M => (
    model.some(
      (inList) => (typeof inList === 'function') ? inList(str) : (str === inList),
    )
  )
}
