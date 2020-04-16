import { Dictionary, IsInstalled, Nullable } from '../helper-types';

export function createIsInstalled(...dependencies: Array<Nullable<Dictionary<unknown>>>): IsInstalled {
  return (id) => !!dependencies.reduce<Dictionary<unknown>>((r, o) => ({ ...r, ...o }), {})[id];
}
