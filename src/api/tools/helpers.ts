export const keys: (
  <K extends string | number | symbol>(
    object: Partial<Record<K, unknown>>,
  ) => Array<K extends string ? K : string>
  // eslint-disable-next-line @typescript-eslint/unbound-method
) = Object.keys;

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { hasOwnProperty: hasOwn } = Object.prototype;
