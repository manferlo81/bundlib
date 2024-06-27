import type { AllowNullish, Dictionary, IsInstalled } from '../types/helper-types';

export function createIsInstalled(...dependencies: Array<AllowNullish<Partial<Dictionary<string>>>>): IsInstalled {

  const reduced = dependencies.reduce<Partial<Dictionary<string>>>(
    (result, deps) => Object.assign(result, deps),
    {},
  );

  return (id): string | undefined => reduced[id];

}
