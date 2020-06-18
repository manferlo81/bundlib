import type { Dictionary, IsInstalled, Nullable } from '../types/helper-types';

export function createIsInstalled(...dependencies: Array<Nullable<Partial<Dictionary<string>>>>): IsInstalled {

  const reduced = dependencies.reduce<Partial<Dictionary<string>>>(
    (result, deps) => Object.assign(result, deps),
    {},
  );

  return (id): string | undefined => reduced[id];

}
