import { Dictionary, IsInstalled, Nullable } from './helper-types';

function createIsInstalled(...dependencies: Nullable<Dictionary<unknown>>[]): IsInstalled {
  return (id) => !!dependencies.reduce<Dictionary<unknown>>((r, o) => ({ ...r, ...o }), {})[id];
}

export default createIsInstalled;
