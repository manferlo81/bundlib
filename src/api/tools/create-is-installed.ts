import { Dictionary, IsInstalled, Nullable } from '../helper-types';

export function createIsInstalled(...dependencies: Array<Nullable<Dictionary<unknown>>>): IsInstalled {

  const reduced = dependencies.reduce<Dictionary<unknown>>(
    (result, deps) => Object.assign(result, deps),
    {},
  );

  return (id) => !!reduced[id];

}
